import express from "express";
import connectDB from "./config/db.js";
import usersRouter from "./routes/api/users.js";
import authRouter from "./routes/api/auth.js";
import postsRouter from "./routes/api/posts.js";
import profileRouter from "./routes/api/profile.js";

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

app.get("/", (req, res) => res.send("API Running"));
// Define Routes
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/profile", profileRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
