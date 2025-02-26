import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


export interface CustomRequest extends Request {
    userId?: string
}

const userAuth = (req: CustomRequest, res: Response, next: NextFunction) => {

    const header = req.headers["authorization"] ?? "";

    try {

        const token = header.split(" ")[1];

        if (!token) {
            res.status(401).json({
                message: "token not found"
            });
            return
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET as string)

        if (!decode) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }

        req.userId = (decode as JwtPayload).userId;
        next();

    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            message: "Internal server error",
            err: error.message
        });
        return
    }
}

export default userAuth;