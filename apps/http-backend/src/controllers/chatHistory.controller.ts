import { prismaClient } from "@repo/db/prisma";
import { Request, Response } from "express"


const chatHistory = async (req: Request, res: Response) => {

    try {
        const roomId = Number(req.params.roomId);

        if (!roomId) {
            res.status(403).json({
                message: "roomId is not provided correctly",
            });
            return;
        }

        const messages = await prismaClient.chat.findMany({
            where: {
                roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        });

        res.status(200).json({
            messages
        });

    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            message: "Internal server error",
            err: error.message
        });
    }


}

export default chatHistory