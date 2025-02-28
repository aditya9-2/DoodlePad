import express from "express";
import userRouter from "./routes/userRouter"
import chatRouter from "./routes/chatRouter"
import cors from "cors"

const app = express();
const port = 8000

app.use(express.json());
app.use(cors({ origin: "*" }))
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chats", chatRouter);


app.listen(port, () => {
    console.log(`listining on: ${port}`);
});
