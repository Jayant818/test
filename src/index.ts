import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


app.post("/data", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  res.status(201).send({ message: "Data received successfully", data });
}