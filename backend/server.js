import express from "express";
import path from "path";
import adminRoutes from "./routes/adminRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import loadUsers from "./middlewares/loadUsers.js";
import session from "express-session";
import flash from "connect-flash";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session setup
app.use(session({
  secret: process.env.SESSION_KEY,   // ⚠️ change this to something strong
  resave: false,
  saveUninitialized: true
}));

// ✅ Flash setup
app.use(flash());


// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), ".." , "frontend", "views"));
console.log("Views directory:", app.get("views"));

// Serve static files (CSS, JS, images)
app.use("/components", express.static(path.join(process.cwd(), "frontend", "components")));


//This middleware runs for all /admin routes
app.use(loadUsers);

// route for admin dashboard
app.use("/admin", adminRoutes);

// route for member dashboard
app.use("/member", memberRoutes);

// route for worker dashboard
app.use("/worker", workerRoutes);

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
