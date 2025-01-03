import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import { connectRedis } from "./src/utils/redis";
import { errorHandler } from "./src/middlewares/error.middleware";
dotenv.config();


import { connectDB } from "./src/connections/komas.database";
import { limiter } from "./src/middlewares/rateLimit";
import userRouter from "./src/user/routes/user.routes";
import vidoeRoutes from "./src/video/routes/video.routes";

(async () => {
  await connectRedis();
  if (!process.env.PORT) { process.exit(1)};

const PORT: number = parseInt(process.env.PORT as string, 10);


const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);


app.get("/", (req, res) => {
  res.send("Hello, Welcome to the Optimal Video App!");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/video", vidoeRoutes);



app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
});
})()
