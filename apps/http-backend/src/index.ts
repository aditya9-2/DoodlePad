import express from "express";
import userRouter from "./routes/userRouter"

const app = express();
const port = 8000

app.use(express.json());

app.use("/api/v1/user", userRouter);


app.listen(port, () => {
    console.log(`listining on: ${port}`);
});
