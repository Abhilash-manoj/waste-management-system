import Admin from "../models/admin.js";
import Feedback from "../models/feedback.js";
import WasteRequest from "../models/wastecollectionrequest.js";

// Show Dashboard (renders page)
export const showDashboard = (req, res) => {
  res.render("adminDashboard", { users: null });
}

// Add User
export const addUser = async (req, res) => {
  const { name, email, password, role, houseNumber, wardNumber } = req.body;

  let extra = {};
  if (role === "Member") {
    extra.houseNumber = houseNumber;
    extra.wardNumber = wardNumber;
  }
  if (role === "Worker") {
    extra.wardNumber = wardNumber;
  }

  try {
    const admin = new Admin(1, "SuperAdmin", "admin@example.com", "hashedPass");

    const userId = await admin.addUser(
      name,
      email,
      password, // in real use → hash this before saving
      role,
      null,
      extra
    );

    res.json({ success: true, message: `User added with ID: ${userId}` });
  } catch (err) {
    console.error("Error adding user:", err.message);
    res.status(500).json({ success: false, message: "Error adding user. Try again." });
  }
}

// Delete User
export const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const admin = new Admin(1,"SuperAdmin", "admin@example.com", "hashedPass");
    const deleted = await admin.deleteUser(userId);

    if (deleted > 0) {
      res.json({ success: true, message: `User deleted with ID: ${userId}` });
    } else {
      res.status(400).json({ success: false, message: "Error deleting user. Try again." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user. Try again." });
  }
}

// View Users
export const viewUsers = async (req, res) => {
  try {
    const admin = new Admin(1, "SuperAdmin", "admin@example.com", "hashedPass");
    const users = await admin.viewUsers();
    console.log("Loaded users:", users);

    res.json({ success: true, data: users });
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ success: false, message: "Failed to load users." });
  }
}

// View Feedback
export const viewFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.viewFeedback();
    console.log("Loaded feedback:", feedback);

    res.json({ success: true, data: feedback });
  } catch (err) {
    console.error("❌ Error fetching feedback:", err.message);
    res.status(500).json({ success: false, message: "Failed to load feedback." });
  }
}

// View Requests
export const viewRequests = async (req, res) => {
  try {
    const requests = await WasteRequest.viewRequests();
    console.log("Loaded requests:", requests);

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("❌ Error fetching requests:", err.message);
    res.status(500).json({ success: false, message: "Failed to load requests." });
  }
}

// Accept Request
export const acceptRequest = async (req, res) => {
  console.log("📩 Hit acceptRequest route, body:", req.body);
  const { newStatus, requestId } = req.body;

  try {
    const accepted = await WasteRequest.updateStatus(newStatus, requestId);
    console.log("Request status updated:", accepted);
    console.log("Request ID:", requestId, "New Status:", newStatus);

    if (accepted > 0) {
      res.json({ success: true, message: `Request accepted with ID: ${requestId}` });
    } else {
      res.status(400).json({ success: false, message: "Failed to accept request" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error accepting request. Try again." });
  }
};


// Confirm Worker Assignment
export const confirmAssign = async (req, res) => {
  const { workerId, requestId } = req.body;

  try {
    const admin = new Admin(1,"SuperAdmin", "admin@example.com", "hashedPass");
    const confirmed = await admin.assignWorker(workerId, requestId);

    if (confirmed > 0) {
      res.json({ success: true, message: `Worker assignment confirmed for ID: ${requestId}` });
    } else {
      res.status(400).json({ success: false, message: "Error confirming worker assignment. Try again." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error confirming worker assignment. Try again." });
  }
}