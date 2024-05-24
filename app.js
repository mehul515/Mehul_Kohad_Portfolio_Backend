import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import {errorMiddleware} from "./middlewares/error.js"
import messageRouter from "./router/messageRoute.js"
import userRouter from "./router/userRoute.js"
import timelineRouter from "./router/timelineRoute.js"
import applicationsRouter from "./router/softwareApplicationsRoute.js"
import skillRouter from "./router/skillRoute.js"
import projrctRouter from "./router/projectRoute.js"

const app = express()
dotenv.config({ path: "./config/.env" });

const corsOptions = {
  origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
  credentials: true // Allow credentials
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/temp/",
    })
)

app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/timeline", timelineRouter);
app.use("/softwareApplications", applicationsRouter);
app.use("/skill", skillRouter);
app.use("/project", projrctRouter);

dbConnection();
app.use(errorMiddleware)


export default app