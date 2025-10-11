import Worker from "../models/worker.js";
import WasteRequest from "../models/wastecollectionrequest.js";
import Member from "../models/member.js";
import { SendNotification } from "../models/notification.js";

class WorkerController {
    constructor(workerModel) {
        this.workerModel = workerModel;
    }

    
  validateInput(workerId, wardNumber, password) {
    const idRegex = /^[A-Za-z0-9\-\/]+$/;
    const wardRegex = /^\d+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    return (
      idRegex.test(workerId) &&
      wardRegex.test(wardNumber) &&
      passRegex.test(password)
    );
  }

  renderLoginPage(req, res) {
    res.render('workerLogin');
  }

async login(req, res) {
  const { workerid, wardnumber, pass } = req.body;

  if (!this.validateInput(workerid, wardnumber, pass)) {
    return res.render("workerLogin", { error: "Invalid input format." });
  }

  try {
    const worker = await this.workerModel.findByWorkerId(workerid);

    if (!worker || String(worker.WardNumber) !== String(wardnumber)) {
      return res.render("workerLogin", { error: "Invalid WorkerID or WardNumber." });
    }

    const isValid = await this.workerModel.verifyPassword(pass, worker.Password);

    if (!isValid) {
      return res.render("workerLogin", { error: "Invalid Password." });
    }

    // ✅ Save worker session
    req.session.worker = {
      WorkerID: worker.Worker_ID,
      WardNumber: worker.WardNumber,
      name: worker.Name,
    };

    res.redirect("/worker/workerdashboard");
  } catch (err) {
    console.error("Worker login error:", err);
    res.status(500).send("Server error");
  }
}

// ✅ Use this single version for rendering dashboard
renderDashboard(req, res) {
  if (!req.session.worker) {
    return res.redirect("/worker/workerlogin");
  }

  res.render("workerDashboard", {
    session: req.session, // <-- make session available to EJS
  });

}

  // Render Worker Dashboard
  showDashboard(req, res) {
    res.render("workerDashboard", { success: [], error: [] });
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

    // View Requests
    async viewRequests(req, res) {
        try {
          const workerId = req.session.worker?.WorkerID;
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
            console.log("Request ID:", requestId, "New Status:", newStatus);

            if (accepted > 0) {
                res.json({ success: true, message: `Request accepted with ID: ${requestId}` });
            } else {
                res.status(400).json({ success: false, message: "Failed to accept request" });
            }
        } catch (error) {
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
            
                        const memberEmail = member.Email;
                        const memberName = member.Name;
                        const details = { selectedDate: selectedDate,
                                        workerName: worker.Name,
                                        workerContact: worker.ContactInfo
                        };
            
                        // ✅ Send task assignment email
                        await SendNotification.sendAcceptedMail(memberEmail, memberName, details);
            console.log("Request status updated:", accepted);
            console.log("Request ID:", requestId, "New Status:", selectedDate);

            if (accepted > 0) {
                res.json({ success: true, message: `Request accepted with ID: ${requestId}` });
            } else {
                res.status(400).json({ success: false, message: "Failed to accept request" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Error accepting request. Try again." });
        }
    }

    // Complete Request
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
            const memberEmail = member.Email;
            const memberName = member.Name;
            const details = {
                workerName: worker.Name,
                requestId: requestId
            };

            // ✅ Send task assignment email
                        await SendNotification.sendCompletionMail(memberEmail, memberName, details);
            console.log("Request status updated:", accepted);
            console.log("Worker task status updated:", completed);
            console.log("Request ID:", requestId, "New Status:", newStatus);

            if (accepted > 0) {
                res.json({ success: true, message: `Request completed with ID: ${requestId}` });
            } else {
                res.status(400).json({ success: false, message: "Failed to complete request" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Error completing request. Try again." });
        }
    }
}

export default WorkerController;
