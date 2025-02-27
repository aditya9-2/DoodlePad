import { Request, Response } from "express";
import { signupSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/prisma"
import bcrypt from "bcryptjs"

const signup = async (req: Request, res: Response) => {


    try {
        const parseData = signupSchema.safeParse(req.body);

        if (!parseData.success) {
            res.status(403).json({
                message: "Invalid inputs",
                errors: parseData.error.errors
            });
            return;
        }

        const { name, username, password, photo } = parseData.data

        const existingUser = await prismaClient.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            res.status(404).json({
                message: "user already exsits"
            });
            return
        }

        const slat = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, slat)

        const userData = await prismaClient.user.create({
            data: {
                username,
                name,
                password: hashedPassword,
                photo
            }

        });

        res.status(201).json({
            message: "user created successfylly",
            user: {
                id: userData.id,
                name: userData.name,
            }
        })

    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            message: "Internal server error",
            err: error
        });
        return;
    }

}
export default signup;