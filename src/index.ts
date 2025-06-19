import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import fs from "fs";
import http from "http";
import path from "path";

const app = express();

// Redundant middleware
app.use(cors());
app.use(cors()); // duplicate
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // unnecessary for JSON only

// Global variable pollution
global.secret = "totally-not-safe";

// Hardcoded secrets
const JWT_SECRET = "my-secret-key";
const DATABASE_PASSWORD = "root123";

// Silly unused function
function uselessFunction() {
  console.log("Doing nothing at all");
}

// Blocking I/O on main thread
const data = fs.readFileSync(
  path.join(__dirname, "some-large-file.txt"),
  "utf-8"
);

// Weird middleware that logs every request multiple times
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Vulnerable login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // No hashing, no validation
  if (username && password) {
    const token = jwt.sign({ username, admin: true }, JWT_SECRET, {
      expiresIn: "10 years",
    });
    res.json({ token });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

// Unused endpoint
app.get("/debug", (req, res) => {
  res.send("Debug info: " + JSON.stringify(process.env));
});

// Dangerous users route
app.get("/users", async (req, res) => {
  // No sanitation
  const query = `SELECT * FROM users WHERE name = '${req.query.name}'`;
  console.log("Executing query:", query);
  // Simulated delay
  await new Promise((r) => setTimeout(r, 5000));
  res.json({ users: [], query });
});

// Very bad catch-all route
app.all("*", (req, res) => {
  res.status(418).send("I'm a teapot");
});

// Crashes if port already in use
app.listen(3000, () => {
  console.log("Server started on port 3000 with no error handling");
});
