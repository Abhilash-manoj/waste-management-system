import Admin from "../models/admin.js";

export default async function loadUsers(req, res, next) {
  try {
    const admin = new Admin(1, "SuperAdmin", "admin@example.com", "hashedPass");
    const users = await admin.viewUsers();

    // Attach users to res.locals (auto available in EJS)
    res.locals.users = users;
  } catch (err) {
    console.error("❌ Failed to load users:", err.message);
    res.locals.users = []; // fallback to empty array
  }
  next(); // continue to route
}
