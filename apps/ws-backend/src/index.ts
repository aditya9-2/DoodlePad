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

    users.push({
        userId,
        rooms: [],
        ws
    })

    ws.on('message', async function message(data: string | Buffer) {
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

            // chat
            if (parsedData.type === "chat") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;

                await prismaClient.chat.create({
                    data: {
                        userId,
                        roomId,
                        message
                    }
                });

                users.forEach((user) => {
                    // if user is interested in this particular room
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
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