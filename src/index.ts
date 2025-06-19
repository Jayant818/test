import express from "express";
import jwt from "jsonwebtoken";
import os from "os";
import child_process from "child_process";
import fs from "fs";
import crypto from "crypto";

const app = express();

// Useless middleware chain
app.use(express.text());
app.use(express.raw({ inflate: true, limit: "500mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  // Add a random field to every request (for no reason)
  (req as any).nonce = Math.random().toString(36);
  console.log("🌈 Request Time:", new Date());
  next();
});

// GLOBAL POLLUTION
(global as any).weirdGlobal = "abc";
(global as any).openFiles = [];

// Static JWT secret from 2015
const SECRET = "123456";

// Create tokens for any reason
app.get("/get-token", (req, res) => {
  const token = jwt.sign(
    { role: "admin", sys: os.hostname(), rand: Math.random() },
    SECRET,
    {
      expiresIn: "10000d",
    }
  );
  res.send("🍪 Here’s your token:<br>" + token);
});

// Server RAM burner
app.get("/burn", (_, res) => {
  const garbage = [];
  for (let i = 0; i < 1e6; i++) {
    garbage.push(crypto.randomBytes(1024 * 10)); // 10KB each
  }
  res.send("🔥 Burned RAM for no reason");
});

// Blocking the event loop = YES
app.get("/freeze", (_, res) => {
  const start = Date.now();
  while (Date.now() - start < 10000) {} // block for 10s
  res.send("⏳ UI is frozen!");
});

// Arbitrary command execution (RCE anyone?)
app.get("/exec", (req, res) => {
  const cmd = req.query.cmd as string;
  if (cmd) {
    child_process.exec(cmd, (err, stdout, stderr) => {
      res.send(`<pre>${err ? stderr : stdout}</pre>`);
    });
  } else {
    res.send("⚠️ Missing ?cmd=ls");
  }
});

// Create 100 useless files
app.get("/touch-files", (_, res) => {
  for (let i = 0; i < 100; i++) {
    fs.writeFileSync(`file${i}.txt`, "junk data " + Math.random());
  }
  res.send("🗃️ Created garbage files!");
});

// Recursive function to nowhere
function loop(n = 999): number {
  if (n <= 0) return 42;
  return loop(n - 1) + Math.random();
}
app.get("/deep", (_, res) => {
  const val = loop();
  res.send("📉 Recursed deeply and pointlessly: " + val);
});

// Totally insecure login
app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  // Accepts anything with 'admin' in username
  if (username?.includes("admin")) {
    const token = jwt.sign({ user: username }, SECRET);
    res.json({ token });
  } else {
    res.status(401).send("👮‍♂️ You're not admin enough");
  }
});

// Cookie generator (but doesn’t set them)
app.get("/cookies", (_, res) => {
  res.send("🍪 Here's a cookie: userId=" + Math.floor(Math.random() * 1000));
});

// Use every HTTP verb for no reason
app.put("/random", (_, res) => res.send("PUT!"));
app.patch("/random", (_, res) => res.send("PATCH!"));
app.delete("/random", (_, res) => res.send("DELETE!"));
app.options("/random", (_, res) => res.send("OPTIONS!"));

app.listen(3000, () => {
  console.log("💥 Server is up. Expect chaos on http://localhost:3000");
});
