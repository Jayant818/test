import express from "express";

const app = express();

app.get("/test", (req, res) => {
  console.log("Route Hit");
  res.send("Test conifirmed");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
