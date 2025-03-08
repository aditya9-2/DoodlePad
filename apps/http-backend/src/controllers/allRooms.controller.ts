import { prismaClient } from "@repo/db/prisma"
import { Request, Response } from "express";

const allRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prismaClient.room.findMany();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching rooms." });
    }
}
export default allRooms