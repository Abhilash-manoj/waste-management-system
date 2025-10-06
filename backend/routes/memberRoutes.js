import express from "express";
import { showDashboard, submitFeedback, submitWasteRequest, viewFeedback } from "../controllers/memberController.js";
import Member from '../models/member.js';
import MemberLoginController from '../controllers/memberLoginController.js';

const router = express.Router();
const memberModel = Member;
const memberController = new MemberLoginController(memberModel);

// Member login routes
router.get('/memberlogin', (req, res) => memberController.renderLoginPage(req, res));
router.post('/member/login', (req, res) => memberController.login(req, res));
router.get('/memberdashboard', (req, res) => memberController.renderDashboard(req, res));

// GET Member Dashboard (renders page)
router.get("/memberdashboard-old", showDashboard); // keep old dashboard route if needed

// POST submit request (form submit)
router.post("/submit-request", submitWasteRequest);


// POST submit feedback (form submit)
router.post("/submit-feedback", submitFeedback);

// View feedback
router.get("/view-feedback", viewFeedback);


export default router;
