import express from "express";
import { router } from "./routes/user.route.js";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import prisma from "./utils/prisma.js";
const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use("/users", router);
const PORT = 3000;
async function StartServer() {
    try {
        await prisma.$connect();
        console.log("✅ Connected to DB");
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to connect to DB:", error);
        process.exit(1);
    }
}
StartServer();
// we will discuss about the helmet and morgan 
// helmet is security for the middlewares by default express apps are not secure it is for the security of the middleware
// Examples of what it does:
// X-Content-Type-Options: nosniff → prevents browsers from MIME-sniffing.
// X-Frame-Options: DENY → prevents clickjacking attacks.
// Strict-Transport-Security → enforces HTTPS.
// Content-Security-Policy → controls which scripts/styles can run.
// what is the morgan 
// Morgan is a request logger middleware for Express.
//# sourceMappingURL=index.js.map