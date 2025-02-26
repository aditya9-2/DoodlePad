import { Request, Response } from "express";
import { signinSchema } from "@repo/common/types";

const signin = (req: Request, res: Response) => {

    const data = signinSchema.safeParse(req.body);

    if (!data.success) {
        res.status(403).json({
            message: "Invalid inputs"
        });
        return
    }

    res.send({
        message: "Hi there"
    })

}
export default signin;