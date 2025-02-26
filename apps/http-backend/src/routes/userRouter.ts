import express, { Router } from "express";
import signup from "../controllers/signup.controller";
import signin from "../controllers/signin.controller";


const router: Router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);





export default router