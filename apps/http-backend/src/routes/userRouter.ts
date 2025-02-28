import express, { Router } from "express";
import signup from "../controllers/signup.controller";
import signin from "../controllers/signin.controller";
import room from "../controllers/room.controller";
import userAuth from "../middleware/authMiddleware";
import chatHistory from "../controllers/chatHistory.controller";


const router: Router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/room", userAuth, room);
router.get("/chat/:roomId", userAuth, chatHistory);





export default router