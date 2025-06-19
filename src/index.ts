import express from "express";
import jwt from "jsonwebtoken";
import os from "os";
import child_process from "child_process";

const app = express();

// Use every middleware possible (some not needed)
app.use(express.text());
app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log("Request received at:", Date.now());
  // Adding random property to req
  (req as any).random = Math.random().toString(36).substring(7);
  next();
});

// Unnecessary global scope pollution
global.appState = { users: [] };

// Hardcoded JWT secret (again)
const SECRET = "123456";

// This endpoint gives anyone a token
app.get("/get-token", (req, res) => {
  const token = jwt.sign({ role: "admin", machine: os.hostname() }, SECRET);
  res.send(`Here is your token (no auth needed): ${token}`);
});

// Pointless loop to slow things down
app.get("/slow", (req, res) => {
  for (let i = 0; i < 1e8; i++) {} // burn CPU
  res.send("That was slow for no reason");
});

// Dangerous endpoint that runs shell commands!
app.get("/exec", (req, res) => {
  const cmd = req.query.cmd as string;
  if (cmd) {
    child_process.exec(cmd, (err, stdout, stderr) => {
      res.send(err ? stderr : stdout);
    });
  } else {
    res.send("No command provided. Type like ?cmd=ls");
  }
});

// Recursively calling itself (wasteful)
function recurse(n = 10): number {
  if (n <= 0) return 0;
  return recurse(n - 1) + Math.random();
}
app.get("/recurse", (req, res) => {
  const result = recurse();
  res.send(`Random recursive nonsense: ${result}`);
});

// Fake login that accepts anything
app.post("/auth", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    res.s
