import express from "express";
import Member from "../models/member.js";
import MemberController from "../controllers/memberController.js";
import { memberLoginValidation, wasteRequestValidation, feedbackValidation } from "../validation/validate.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();
const memberModel = Member;
const memberController = new MemberController(memberModel);

// Member login routes
router.get("/memberlogin", (req, res) => memberController.renderLoginPage(req, res));
router.post("/memberlogin", memberLoginValidation, validateRequest, (req, res) => memberController.login(req, res));
router.get("/memberdashboard", (req, res) => memberController.renderDashboard(req, res));

// GET Member Dashboard (renders page)
router.get("/memberdashboard-old", (req, res) => memberController.showDashboard(req, res)); // keep old dashboard route if needed

// POST submit request (form submit)
router.post("/submitrequest", wasteRequestValidation, validateRequest, (req, res) => memberController.submitWasteRequest(req, res));

// POST submit request (form submit)
router.get("/viewrequests", (req, res) => memberController.viewRequests(req, res));

// POST submit feedback (form submit)
router.post("/submitfeedback", feedbackValidation, validateRequest, (req, res) => memberController.submitFeedback(req, res));

// GET View feedback
router.get("/viewfeedback", (req, res) => memberController.viewFeedback(req, res));

export default router;
