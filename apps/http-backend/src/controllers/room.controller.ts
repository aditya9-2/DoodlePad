import { roomSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/prisma";
import { Response } from "express"
import { CustomRequest } from "../middleware/authMiddleware";


const room = async (req: CustomRequest, res: Response) => {

    const parsedData = roomSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(403).json({
            message: "invalid inputs",
        });
        return;
    }

    try {
        const userId = req.userId;

        if (!userId) {
            res.status(403).json({
                message: "Unauthorized"
            })
            return;
        }

        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })
        res.status(201).json({
            message: "room created successfully",
            roomId: room.id
        });


    } catch (err) {
        const error = err as Error
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
        return
    }


}
export default room