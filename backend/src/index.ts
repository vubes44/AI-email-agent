import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("działa");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Server działa na http://localhost:3000");
});
