import { z } from "zod"

export const signupSchema = z.object({
    name: z.string().min(3).max(30),
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20)
});

export const signinSchema = z.object({

    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20)
});
export const roomSchema = z.object({
    name: z.string().min(3).max(30),
    // username: string().min(3).max(20),
    // password: string().min(6).max(20)
});