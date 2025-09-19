import Worker from "../models/worker.js";
import WasteRequest from "../models/wastecollectionrequest.js";



// Show Dashboard (renders page)
export const showDashboard = (req, res) => {
  res.render("workerDashboard", { users: null });
}


export const getAvailableWorkers = async (req, res) => {
  const { requestId } = req.body;
  console.log("📩 Hit getAvailableWorkers route, body:", req.body);
  try {
    const workers = await Worker.getAvailable(requestId);
    res.json({ success: true, data: workers });
  } catch (err) {
    console.error("❌ Error fetching workers:", err.message);
    res.status(500).json({ success: false, message: "Failed to load workers." });
  }
};


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


// Reassign Worker
export const reassignWorker = async (req, res) => {
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
};

// get Dates
export const getDates = async (req, res) => {
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
};

// Accept Task
export const confirmTaskDate = async (req, res) => {
  console.log("📩 Hit confirmTaskDate route, body:", req.body);
  const { selectedDate, requestId } = req.body;

  try {
    const accepted = await WasteRequest.updateDate(selectedDate, requestId);
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
};

// Complete Request
export const completeTask = async (req, res) => {
  console.log("📩 Hit completeTask route, body:", req.body);
  const { newStatus, requestId, workerId } = req.body;

  try {
    const accepted = await WasteRequest.updateStatus(newStatus, requestId);
    const completed = await Worker.markTaskCompleted(workerId);
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
};