import { Request, Response } from "express";
import { signupSchema } from "@repo/common/types"


const signup = (req: Request, res: Response) => {

    const data = signupSchema.safeParse(req.body);

    if (!data.success) {
        res.status(403).json({
            message: "Invalid inputs"
        });
        return;
    }

    res.send({
        message: "Hi there"
    })

}
export default signup;