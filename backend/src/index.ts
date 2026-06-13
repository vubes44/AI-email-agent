import express from "express";
import authRoutes from "./routes/auth.js";

const app = express();

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("AI Email Agent działa");
});

app.listen(3000, () => {
  console.log("Server działa na http://localhost:3000");
});
