import express, { Router } from "express";

import userAuth from "../middleware/authMiddleware";
import chatHistory from "../controllers/chatHistory.controller";


const router: Router = express.Router();

router.get("/:roomId", userAuth, chatHistory);





export default router