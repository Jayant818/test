import express from "express";
<<<<<<< Updated upstream

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
=======
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());
app.use(cors());

// Potential security issue: hardcoded secret
const JWT_SECRET = "my-secret-key";

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Potential bug: no input validation
  if (username && password) {
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

// Performance issue: no rate limiting
app.get("/users", async (req, res) => {
  // Potential SQL injection vulnerability
  const query = `SELECT * FROM users WHERE name = '${req.query.name}'`;
  // ... database query
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
>>>>>>> Stashed changes
});
