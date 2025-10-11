import Admin from "../models/admin.js";
import Feedback from "../models/feedback.js";
import WasteRequest from "../models/wastecollectionrequest.js";
import Worker from "../models/worker.js";
import bcrypt from 'bcrypt';
import { SendNotification } from "../models/notification.js";
import Member from "../models/member.js";

class AdminController {
  constructor(adminModel) {
    this.adminModel = adminModel;
  }

  // ✅ Render admin login page
  renderLoginPage(req, res) {
    res.render('adminLogin');
  }

  // ✅ Handle login POST request
  async login(req, res) {
    try {
      const { admin, pass } = req.body;

      // 🔒 Validate input
      if (!admin || !pass || pass.length < 6) {
        return res.render('adminLogin', {
          error: 'Admin ID cannot be empty and password must be at least 6 characters.'
        });
      }

      // 🔍 Find admin in database
      const adminData = await this.adminModel.findByAdminId(admin);
      if (!adminData) {
        console.log("❌ Admin not found:", admin);
        return res.render('adminLogin', {
          error: 'Invalid Admin ID or password.'
        });
      }

      // 🧩 Check if Password field exists
      const hashedPassword = adminData.Password || adminData.password;
      if (!hashedPassword) {
        console.error("⚠️ No password field found for admin:", admin);
        return res.render('adminLogin', {
          error: 'Invalid Admin ID or password.'
        });
      }

      // 🔑 Compare password securely
      const match = await bcrypt.compare(pass, hashedPassword);
      if (!match) {
        console.log("❌ Password mismatch for admin:", admin);
        return res.render('adminLogin', {
          error: 'Invalid Admin ID or password.'
        });
      }

      // ✅ Create session
      if (!req.session) {
        console.error("⚠️ Session not initialized.");
        return res.status(500).send("Session not initialized");
      }

      req.session.admin = admin;
      console.log("✅ Admin logged in:", admin);
      res.redirect('/admin/admindashboard');
    } catch (err) {
      console.error("⚠️ Error in admin login:", err);
      res.render('adminLogin', {
        error: 'Something went wrong. Please try again.'
      });
    }
  }

  // ✅ Render admin dashboard
  renderDashboard(req, res) {
    if (!req.session || !req.session.admin) {
      return res.redirect('/admin/adminLogin');
    }

    res.render('adminDashboard', {
      adminId: req.session.admin
    });
  }

  // Show Dashboard (renders page)
  showDashboard(req, res) {
    res.render("adminDashboard", { users: null });
  }
// Add User
async addUser(req, res) {
  const { name, email, password, role, contactInfo, extra } = req.body;

  try {
    // ✅ Check if admin is logged in
    const sessionAdmin = req.session?.admin;
    if (!sessionAdmin) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const admin = new Admin(
      sessionAdmin.id,
      sessionAdmin.email,
      "hashedPass" // Hash inside addUser if needed
    );

    const userId = await admin.addUser(
      name,
      email || null,
      password,
      role,
      contactInfo || null,
      extra || {} // pass extra directly
    );

    res.json({ success: true, message: `User added with ID: ${userId}`, userId });
  } catch (err) {
    console.error("❌ Error adding user:", err.message);
    res.status(500).json({ success: false, message: "Error adding user. Try again." });
  }
}

  // Delete User
  async deleteUser(req, res) {
    const { userId } = req.body;

    try {
      const sessionAdmin = req.session?.admin;
      const admin = new Admin(
        sessionAdmin?.id,
        sessionAdmin?.email,
        "hashedPass"
      );

      const deleted = await admin.deleteUser(userId);

      if (deleted > 0) {
        res.json({ success: true, message: `User deleted with ID: ${userId}` });
      } else {
        res.status(400).json({ success: false, message: "Error deleting user. Try again." });
      }
    } catch (error) {
      console.error("❌ Error deleting user:", error.message);
      res.status(500).json({ success: false, message: "Error deleting user. Try again." });
    }
  }

  // View Users
  async viewUsers(req, res) {
    try {
      const sessionAdmin = req.session?.admin;
      const admin = new Admin(
        sessionAdmin?.id,
        sessionAdmin?.email,
        "hashedPass"
      );

      const users = await admin.viewUsers();
      console.log("Loaded users:", users);

      res.json({ success: true, data: users });
    } catch (err) {
      console.error("❌ Error fetching users:", err.message);
      res.status(500).json({ success: false, message: "Failed to load users." });
    }
  }

  // View Feedback
  async viewFeedback(req, res) {
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
  async viewRequests(req, res) {
    try {
      const requests = await WasteRequest.viewRequests();
      console.log("Loaded requests:", requests);

      res.json({ success: true, data: requests });
    } catch (err) {
      console.error("❌ Error fetching requests:", err.message);
      res.status(500).json({ success: false, message: "Failed to load requests." });
    }
  }

  // Reject Request
  async rejectRequest(req, res) {
    console.log("📩 Hit rejectRequest route, body:", req.body);
    const { newStatus, requestId } = req.body;

    try {
      const rejected = await WasteRequest.updateStatus(newStatus, requestId);
      const request = await WasteRequest.findByRequestId(requestId);
      const member = await Member.findByHouseNumber(request.HouseNumber);

        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

            const memberEmail = member.Email;
            const memberName = member.Name;

            // ✅ Send task assignment email
            await SendNotification.sendRejectionMail(memberEmail, memberName);
      console.log("Request status updated:", rejected);
      console.log("Request ID:", requestId, "New Status:", newStatus);

      if (rejected > 0) {
        res.json({ success: true, message: `Request rejected with ID: ${requestId}` });
      } else {
        res.status(400).json({ success: false, message: "Failed to reject request" });
      }
    } catch (error) {
      console.error("❌ Error rejecting request:", error.message);
      res.status(500).json({ success: false, message: "Error rejecting request. Try again." });
    }
  }

  // Confirm Worker Assignment
  async confirmAssign(req, res) {
    const { workerId, requestId } = req.body;

    try {
      const sessionAdmin = req.session?.admin;
      const admin = new Admin(
        sessionAdmin?.id,
        sessionAdmin?.email,
        "hashedPass"
      );

      const confirmed = await admin.assignWorker(workerId, requestId);
      const worker = await Worker.findByWorkerId(workerId);

          if (worker > 0) {
                return res.status(404).json({ success: false, message: "Worker not found" });
            }

            const workerEmail = worker.Email;
            const workerName = worker.Name;

            // ✅ Send task assignment email
            await SendNotification.sendTaskMail(workerEmail, workerName);

      if (confirmed > 0) {
        res.json({ success: true, message: `Worker assignment confirmed for ID: ${requestId}` });
      } else {
        res.status(400).json({ success: false, message: "Error confirming worker assignment. Try again." });
      }
    } catch (error) {
      console.error("❌ Error confirming worker assignment:", error.message);
      res.status(500).json({ success: false, message: "Error confirming worker assignment. Try again." });
    }
  }
}

export default AdminController;
