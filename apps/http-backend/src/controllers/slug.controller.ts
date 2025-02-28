import { prismaClient } from "@repo/db/prisma";
import { Request, Response } from "express";

const slug = async (req: Request, res: Response) => {

    try {

        const slug = req.params.slug;

        if (!slug) {
            res.send(403).json({
                message: "Invalid slug"
            });
            return
        }

        const room = await prismaClient.room.findFirst({
            where: {
                slug
            }
        });

        res.status(200).json({
            room
        });

    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            message: "Internal server error",
            err: error.message
        });
    }

}
export default slug