import { Request, Response } from "express";
import { signinSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/prisma";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/configs/config"

const signin = async (req: Request, res: Response) => {

    const parseData = signinSchema.safeParse(req.body);

    if (!parseData.success) {
        res.status(403).json({
            message: "Invalid inputs"
        });
        return
    }

    try {

        const { username, password } = parseData.data;

        const user = await prismaClient.user.findUnique({
            where: { username }
        });

        if (!user) {
            res.status(404).json({
                message: "user not found"
            });
            return;
        }

        const decodepassword = await bcrypt.compare(password, user.password);

        if (!decodepassword) {
            res.status(403).json({
                message: "wrong password"
            });
            return;
        }

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET);

        res.status(200).json({
            message: "signin successfull",
            token,
            user: {
                id: user.id,
                name: user.username
            }
        });
    } catch (err) {
        const error = err as Error
        res.status(500).json({
            message: "Internal server error",
            err: error.message
        })
    }


}
export default signin;