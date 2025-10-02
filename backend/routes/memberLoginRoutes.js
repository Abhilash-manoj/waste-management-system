import express from 'express';
import MemberLoginModel from '../models/memberLoginModels.js';
import MemberLoginController from '../controllers/memberLoginController.js';

const router = express.Router();
const memberModel = new MemberLoginModel();
const memberController = new MemberLoginController(memberModel);

router.get('/memberlogin', (req, res) => memberController.renderLoginPage(req, res));
router.post('/member/login', (req, res) => memberController.login(req, res));
router.get('/memberdashboard', (req, res) => memberController.renderDashboard(req, res));

export default router;