import express from 'express';
import AdminLoginModel from '../models/adminLoginModels.js';
import AdminController from '../controllers/adminLoginController.js';

const router = express.Router();
const adminModel = new AdminLoginModel();
const adminController = new AdminController(adminModel);

router.get('/adminlogin', (req, res) => adminController.renderLoginPage(req, res));
router.post('/adminlogin', (req, res) => adminController.login(req, res));
router.get('/admindashboard', (req, res) => adminController.renderDashboard(req, res));

export default router;