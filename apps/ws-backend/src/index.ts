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
// empty users array where we push all the userId, rooms[] and their socket object
const users: Users[] = []

// verifies the token with secret and returns the userId
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

wss.on('connection', function connection(ws, req) {

    // take the url
    const url = req.url;
    if (!url) return;
    const queryParams = new URLSearchParams(url.split("?")[1])
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if (userId == null) {
        ws.close();
        return;
    }

    // const existingUser = users.find(user => user.userId === userId);

    users.push({
        userId,
        rooms: [],
        ws
    });


    ws.on('message', async function message(data: string | Buffer) {
        // console.log(data)
        try {
            // Parse the string data into JSON data
            let parsedData = JSON.parse(data.toString());

            // if user wants to join the room
            if (parsedData.type === "join_room") {
                const findUser = users.find(user => user.ws === ws);
                if (findUser) {
                    findUser.rooms.push(parsedData.roomId);
                }
            }

            // if user wants to leave the room
            if (parsedData.type === "leave_room") {
                const findUser = users.find(user => user.ws === ws);

                if (!findUser) return;

                findUser.rooms = findUser.rooms.filter(roomId => roomId !== parsedData.roomId);
            }

            //delete 
            if (parsedData.type === "delete_shapes") {
                const roomId = parsedData.roomId;
                const shapeIds: string[] = parsedData.shapeIds;

                // Guard clause: if no shape IDs provided, do nothing
                if (!shapeIds || shapeIds.length === 0) {
                    return;
                }

                // Fetch all chat messages for the room
                const messages = await prismaClient.chat.findMany({
                    where: {
                        roomId: Number(roomId),
                    },
                });

                // Find messages to delete by parsing the message field
                const messageIdsToDelete = messages
                    .filter((msg) => {
                        try {
                            const parsed = JSON.parse(msg.message);
                            return parsed.shape && parsed.shape.id && shapeIds.includes(parsed.shape.id);
                        } catch (e) {
                            return false; // Skip invalid JSON messages
                        }
                    })
                    .map((msg) => msg.id);

                // Delete the identified messages
                await prismaClient.chat.deleteMany({
                    where: {
                        id: {
                            in: messageIdsToDelete,
                        },
                    },
                });

                // Broadcast the deletion event to all connected clients in the same room
                users.forEach((user) => {
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "delete_shapes",
                            roomId,
                            shapeIds,
                        }));
                    }
                });
                return;
            }

            // chat
            if (parsedData.type === "chat") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;

                const response = await prismaClient.chat.create({
                    data: {
                        userId,
                        roomId: Number(roomId),
                        message
                    }
                });

                users.forEach((user) => {
                    // if user is interested in this particular room
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message,
                            roomId
                        }));
                    }
                });
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