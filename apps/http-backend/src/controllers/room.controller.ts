import { roomSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/prisma";
import { Request, Response } from "express"

export interface CustomRequest extends Request {
    userId?: string
}
const room = async (req: CustomRequest, res: Response) => {

    const paresedData = roomSchema.safeParse(req.body);

    if (!paresedData.success) {
        res.status(403).json({
            message: "invalid inputs",
        });
        return;
    }

    try {

        const userId = req.userId;

        if (!userId) {
            res.status(400).json({
                message: "User ID is required",
            });
            return;
        }

        await prismaClient.room.create({
            data: {
                slug: paresedData.data.name,
                adminId: userId
            }
        });

    } catch (err: any) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }


}
export default room