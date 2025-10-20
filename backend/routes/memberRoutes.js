import express from "express";
import Member from "../models/member.js";
import MemberController from "../controllers/memberController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import ValidationRules from "../validation/validate.js"; // ✅ static validation class

const router = express.Router();
const memberModel = Member;
const memberController = new MemberController(memberModel);

// ✅ Member login routes
router.get("/memberlogin", (req, res) => memberController.renderLoginPage(req, res));
router.post(
  "/memberlogin",
  ValidationRules.memberLoginValidation, // ✅ fixed to static method name
  validateRequest,
  (req, res) => memberController.login(req, res)
);

// ✅ Member dashboard
router.get("/memberdashboard", (req, res) => memberController.renderDashboard(req, res));

// ✅ Optional legacy dashboard route
router.get("/memberdashboard-old", (req, res) => memberController.showDashboard(req, res));

// ✅ Submit waste request
router.post(
  "/submitrequest",
  ValidationRules.wasteRequestValidation, // ✅ fixed to static usage
  validateRequest,
  (req, res) => memberController.submitWasteRequest(req, res)
);

// ✅ View waste requests
router.get("/viewrequests", (req, res) => memberController.viewRequests(req, res));

// ✅ Submit feedback
router.post(
  "/submitfeedback",
  ValidationRules.feedbackValidation, // ✅ fixed to static usage
  validateRequest,
  (req, res) => memberController.submitFeedback(req, res)
);

// ✅ View feedback
router.get("/viewfeedback", (req, res) => memberController.viewFeedback(req, res));

export default router;
