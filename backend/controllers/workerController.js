import Worker from "../models/worker.js";
import WasteRequest from "../models/wastecollectionrequest.js";
import Member from "../models/member.js";
import { SendNotification } from "../models/notification.js";
import User from "../models/user.js";

class WorkerController {
  constructor(workerModel) {
    this.workerModel = workerModel;
  }

  // Render login page
  renderLoginPage(req, res) {
    res.render("workerLogin");
  }

  // Worker Login
  async login(req, res) {
    const { email, pass } = req.body;

    try {
      const worker = await this.workerModel.findByEmail(email);
      if (!worker) {
        return res.render("workerLogin", { error: "Invalid Email or Password." });
      }

      const isValid = await this.workerModel.verifyPassword(pass, worker.Password);
      if (!isValid) {
        return res.render("workerLogin", { error: "Invalid Email or Password." });
      }

      // ✅ Save worker session
      req.session.worker = {
        id: worker.Worker_ID,
        WardNumber: worker.WardNumber,
        name: worker.Name,
        email: worker.Email,
        contactInfo: worker.ContactInfo,
        role: worker.Role,
        profilePicture: worker.ProfilePicture,
      };

      res.redirect("/worker/workerdashboard");
    } catch (err) {
      console.error("Worker login error:", err);
      res.status(500).send("Server error");
    }
  }

  // Render Worker Dashboard
  renderDashboard(req, res) {
    if (!req.session.worker) {
      return res.redirect("/worker/workerlogin");
    }

    res.render("workerDashboard", { session: req.session });
  }

  // Render Worker Edit Profile
  workerEditProfile(req, res) {
    if (!req.session.worker) {
      return res.redirect("/worker/workerlogin");
    }
    res.render("workerEditProfile", { session: req.session });
  }

  // Get Available Workers
  async getAvailableWorkers(req, res) {
    const { requestId } = req.body;
    console.log("📩 Hit getAvailableWorkers route, body:", req.body);
    try {
      const workers = await Worker.getAvailable(requestId);
      res.json({ success: true, data: workers });
    } catch (err) {
      console.error("❌ Error fetching workers:", err.message);
      res.status(500).json({ success: false, message: "Failed to load workers." });
    }
  }

  // Update Worker Profile
  async updateProfile(req, res) {
    try {
      const {
        fullName,
        contactInfo,
        email,
        userId = req.session?.worker?.id || req.body.workerId,
      } = req.body;

      if (!userId) {
        return res
          .status(401)
          .json({ message: "You must be logged in to update a profile." });
      }

      let profilePicPath = req.session.worker.profilePicture;
      if (req.file) {
        profilePicPath = req.file.path.replace("public", "").replace(/\\/g, "/");
      }

      await User.updateWorkerProfile(email, fullName, contactInfo, profilePicPath, userId);
      console.log("worker Profile is:", profilePicPath);

      req.session.worker.name = fullName;
      req.session.worker.email = email;
      req.session.worker.contact = contactInfo;
      req.session.worker.profilePicture = profilePicPath;

      res.status(200).json({ success: true, message: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error in updateProfile controller:", error);
      res
        .status(500)
        .json({ success: false, message: "An error occurred while updating the profile." });
    }
  }

  // Change Password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const workerId = req.session?.worker?.id || req.body.workerId;

      if (!workerId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const worker = new User();
      const success = await worker.changePassword(workerId, currentPassword, newPassword);

      if (success) {
        res.json({ success: true, message: "Password updated successfully." });
      } else {
        res.status(400).json({ success: false, message: "Current password is incorrect." });
      }
    } catch (err) {
      console.error("❌ Error changing password:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // View Requests
  async viewRequests(req, res) {
    try {
      const workerId = req.session.worker?.id;
      const requests = await WasteRequest.viewRequests(workerId, "worker");
      console.log("Loaded requests:", requests);

      res.json({ success: true, data: requests });
    } catch (err) {
      console.error("❌ Error fetching requests:", err.message);
      res.status(500).json({ success: false, message: "Failed to load requests." });
    }
  }

  // Reassign Worker
  async reassignWorker(req, res) {
    console.log("📩 Hit reassignWorker route, body:", req.body);
    const { newStatus, requestId, workerId } = req.body;

    try {
      const accepted = await Worker.requestReassignment(newStatus, requestId, workerId);
      console.log("Request status updated:", accepted);

      if (accepted && (accepted.affectedRows > 0 || accepted > 0 || accepted === true)) {
        return res.status(200).json({
          success: true,
          message: `✅ Request reassignment successful for ID: ${requestId}`,
        });
      }

      res.status(400).json({ success: false, message: "⚠️ Could not update request status." });
    } catch (error) {
      console.error("❌ Error in reassignWorker:", error);
      res.status(500).json({ success: false, message: "Error accepting request. Try again." });
    }
  }

  // Get Dates
  async getDates(req, res) {
    console.log("📩 Hit getDates route, body:", req.body);
    const { requestId } = req.body;

    try {
      const dates = await WasteRequest.getDates(requestId);
      console.log("Fetched dates:", dates);
      res.json({ success: true, data: dates });
    } catch (error) {
      console.error("❌ Error fetching dates:", error.message);
      res.status(500).json({ success: false, message: "Failed to fetch dates." });
    }
  }

  // Accept Task
  async confirmTaskDate(req, res) {
    console.log("📩 Hit confirmTaskDate route, body:", req.body);
    const { selectedDate, requestId } = req.body;

    try {
      const accepted = await WasteRequest.updateDate(selectedDate, requestId);
      const request = await WasteRequest.findByRequestId(requestId);
      const member = await Member.findByHouseNumber(request.HouseNumber);
      const worker = await Worker.findByWorkerId(request.AssignedWorker_ID);

      if (!member) {
        return res.status(404).json({ success: false, message: "Member not found" });
      }

      await SendNotification.sendAcceptedMail(member.Email, member.Name, {
        selectedDate,
        workerName: worker.Name,
        workerContact: worker.ContactInfo,
      });

      if (accepted && (accepted.affectedRows > 0 || accepted > 0 || accepted === true)) {
        return res.status(200).json({
          success: true,
          message: `✅ Task date confirmed for Request ID: ${requestId}`,
        });
      }

      res.status(400).json({ success: false, message: "⚠️ Failed to update task date." });
    } catch (error) {
      console.error("❌ Error in confirmTaskDate:", error);
      res
        .status(500)
        .json({ success: false, message: "Error confirming task date. Try again." });
    }
  }

  // Complete Task
  async completeTask(req, res) {
    console.log("📩 Hit completeTask route, body:", req.body);
    const { newStatus, requestId, workerId } = req.body;

    try {
      const accepted = await WasteRequest.updateStatus(newStatus, requestId);
      const completed = await Worker.markTaskCompleted(workerId);
      const request = await WasteRequest.findByRequestId(requestId);
      const member = await Member.findByHouseNumber(request.HouseNumber);
      const worker = await Worker.findByWorkerId(request.AssignedWorker_ID);

      if (!member) {
        return res.status(404).json({ success: false, message: "Member not found" });
      }

      await SendNotification.sendCompletionMail(member.Email, member.Name, {
        workerName: worker.Name,
        requestId,
      });

      if (accepted && (accepted.affectedRows > 0 || accepted > 0 || accepted === true)) {
        return res.status(200).json({
          success: true,
          message: `✅ Request completed successfully (ID: ${requestId})`,
        });
      }

      res.status(400).json({ success: false, message: "⚠️ Failed to complete request." });
    } catch (error) {
      console.error("❌ Error in completeTask:", error);
      res.status(500).json({ success: false, message: "Error completing request. Try again." });
    }
  }
}

export default WorkerController;
