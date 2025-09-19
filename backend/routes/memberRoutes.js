import express from "express";
import { showDashboard, submitFeedback, submitWasteRequest, viewFeedback } from "../controllers/memberController.js";

const router = express.Router();

// GET Member Dashboard (renders page)
router.get("/memberdashboard", showDashboard);

// POST submit request (form submit)
router.post("/submit-request", submitWasteRequest);


// POST submit feedback (form submit)
router.post("/submit-feedback", submitFeedback);

// View feedback
router.get("/view-feedback", viewFeedback);


export default router;
