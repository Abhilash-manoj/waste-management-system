import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import loadUsers from "./middlewares/loadUsers.js";

dotenv.config();

const app = express();

//  Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Session setup
app.use(session({
  secret: process.env.SESSION_KEY || "your_super_secret_key",
  resave: false,
  saveUninitialized: true
}));

//  Flash messages
app.use(flash());

//  View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "frontend", "views"));

app.use(express.static(path.join(__dirname, 'public')));

//  Static assets
app.use("/components", express.static(path.join(__dirname, "..", "frontend", "components")));

//  Admin middleware
app.use("/admin", loadUsers);


app.get("/home", (req, res) => {
  console.log("🔥 /home route hit");
  res.render("home");
});


app.get("/aboutus", (req, res) => {
  res.render("aboutus");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/workereditprofile", (req, res) => {
  res.render("workereditprofile");
});

// ✅ Route registration
app.use("/admin", adminRoutes);
app.use("/member", memberRoutes);
app.use("/worker", workerRoutes);

//  Start server
app.listen(5000, () => {
  console.log(" Server running at http://localhost:5000");
});