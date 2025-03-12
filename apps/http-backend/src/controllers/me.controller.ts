import { prismaClient } from "@repo/db/prisma";
import { Request, Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";

const me = async (req: CustomRequest, res: Response) => {
    try {

        const userId = req.userId;


        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                name: true
            }
        });

        if (!user) {
            res.status(404).json({
                message: "user not found"
            });
            return;
        }

        res.status(200).json({
            message: user.name
        });

    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            message: "Internal server error",
            err: error
        });
        return;

    }
}

export default me;