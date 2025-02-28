import express, { Router } from "express";
import signup from "../controllers/signup.controller";
import signin from "../controllers/signin.controller";
import room from "../controllers/room.controller";
import userAuth from "../middleware/authMiddleware";
import slug from "../controllers/slug.controller";



const router: Router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/room", userAuth, room);
router.get("/room/:slug", slug)






export default router