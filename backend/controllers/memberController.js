import Member from "../models/member.js";
import Feedback from "../models/feedback.js";

// Render Member Dashboard
export const showDashboard = (req, res) => {
  // Send empty arrays for success/error to prevent EJS ReferenceError
  res.render("memberDashboard", { success: [], error: [] });
};

// Submit a waste collection request
export const submitWasteRequest = async (req, res) => {
  const { memberId, wasteType, houseNumber, wardNumber, preferredDateStart, preferredDateEnd } = req.body;

  try {
    const member = new Member(1, "SuperAdmin", "admin@example.com", "hashedPass", null, "House 1", "Ward 1");

    const requestId = await member.submitWasteRequest(
      memberId,
      wasteType,
      houseNumber,
      wardNumber,
      preferredDateStart,
      preferredDateEnd
    );

    // Respond with JSON instead of redirect & flash
    res.json({ success: true, message: `Request submitted with ID: ${requestId}`, requestId });
  } catch (err) {
    console.error("Error submitting request:", err.message);
    res.status(500).json({ success: false, message: "Error submitting request. Try again." });
  }
};

// Submit feedback
export const submitFeedback = async (req, res) => {
  const { memberId, comment, datesubmitted } = req.body;

  try {
    const feedbackId = await Feedback.submitFeedback(memberId, comment, datesubmitted);

    // Respond with JSON
    res.json({ success: true, message: `Feedback submitted with ID: ${feedbackId}`, feedbackId });
  } catch (err) {
    console.error("Error submitting feedback:", err.message);
    res.status(500).json({ success: false, message: "Error submitting feedback. Try again." });
  }
};

// View feedback (for member dashboard)
export const viewFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.viewFeedback();
    console.log("Loaded feedback:", feedback);

    res.json({ success: true, data: feedback });
  } catch (err) {
    console.error("Error fetching feedback:", err.message);
    res.status(500).json({ success: false, message: "Failed to load feedback." });
  }
};
