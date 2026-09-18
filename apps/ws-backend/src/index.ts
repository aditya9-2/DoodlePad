import { WebSocket, WebSocketServer } from 'ws';
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/configs/config"
import { prismaClient } from "@repo/db/prisma"

const wss = new WebSocketServer({ port: 8080 });

interface Users {
    ws: WebSocket;
    rooms: string[],
    userId: string
}

const users: Users[] = []

const checkUser = (token: string): string | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded == "string" || !decoded.userId) return null;
        return decoded.userId;
    } catch (err) {
        console.log(`unauthorized`);
        return null;
    }
};

function broadcastToRoom(roomId: string, payload: object, exceptWs?: WebSocket) {
    users.forEach((user) => {
        if (user.rooms.includes(roomId) && user.ws !== exceptWs && user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify(payload));
        }
    });
}

wss.on('connection', function connection(ws, req) {
    const url = req.url;
    if (!url) return;
    const queryParams = new URLSearchParams(url.split("?")[1])
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if (userId == null) {
        ws.close();
        return;
    }

    users.push({ userId, rooms: [], ws });

    ws.on('close', () => {
        const idx = users.findIndex(user => user.ws === ws);
        if (idx !== -1) users.splice(idx, 1);
    });

    ws.on('error', () => {
        const idx = users.findIndex(user => user.ws === ws);
        if (idx !== -1) users.splice(idx, 1);
    });

    ws.on('message', async function message(data: string | Buffer) {
        try {
            let parsedData = JSON.parse(data.toString());

            if (parsedData.type === "join_room") {
                const findUser = users.find(user => user.ws === ws);
                if (findUser) {
                    findUser.rooms.push(parsedData.roomId);
                }
                return;
            }

            if (parsedData.type === "leave_room") {
                const findUser = users.find(user => user.ws === ws);
                if (!findUser) return;
                findUser.rooms = findUser.rooms.filter(roomId => roomId !== parsedData.roomId);
                return;
            }

            if (parsedData.type === "draw_update") {
                const roomId = parsedData.roomId;
                broadcastToRoom(roomId, {
                    type: "draw_update",
                    roomId,
                    fromUserId: userId,
                    shape: parsedData.shape,
                }, ws);
                return;
            }

            if (parsedData.type === "delete_shapes") {
                const roomId = parsedData.roomId;
                const shapeIds: string[] = parsedData.shapeIds;

                if (!shapeIds || shapeIds.length === 0) return;

                // Broadcast first so deletion feels instant, persist after.
                broadcastToRoom(roomId, { type: "delete_shapes", roomId, shapeIds });

                const messages = await prismaClient.chat.findMany({
                    where: { roomId: Number(roomId) },
                });

                const messageIdsToDelete = messages
                    .filter((msg: { message: string }) => {
                        try {
                            const parsed = JSON.parse(msg.message);
                            return parsed.shape && parsed.shape.id && shapeIds.includes(parsed.shape.id);
                        } catch (e) {
                            return false;
                        }
                    })
                    .map((msg: { id: any }) => msg.id);

                await prismaClient.chat.deleteMany({
                    where: { id: { in: messageIdsToDelete } },
                });
                return;
            }

            if (parsedData.type === "chat") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;

                broadcastToRoom(roomId, {
                    type: "chat",
                    message,
                    roomId,
                    fromUserId: userId,
                });

                prismaClient.chat.create({
                    data: { userId, roomId: Number(roomId), message }
                }).catch((err) => {
                    console.error("Failed to persist chat/shape:", err);
                });
                return;
            }
        } catch (error) {
            console.error("Error processing message:", error);
            console.log("Received invalid data:", data.toString());
            ws.send(JSON.stringify({
                type: "error",
                message: "Invalid JSON format"
            }));
        }
    });
});