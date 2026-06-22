const express = require("express");
const cookieParser= require("cookie-parser")
const cors = require("cors")

const app = express();



app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://interview-prep-app-two-beta.vercel.app",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}))


// require all the auth routes here
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes")

// using all routes here
app.use("/api/auth",authRouter);
app.use("/api/interview", interviewRouter)




module.exports = app;