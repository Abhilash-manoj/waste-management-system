import express from "express";
import Admin from '../models/admin.js';
import AdminController from '../controllers/adminController.js';

const router = express.Router();
const adminModel = Admin;
const adminController = new AdminController(adminModel);

// Admin login routes
router.get('/adminlogin', (req, res) => adminController.renderLoginPage(req, res));
router.post('/adminlogin', (req, res) => adminController.login(req, res));
router.get('/admindashboard', (req, res) => adminController.renderDashboard(req, res));

// Dashboard
router.get("/dashboard", (req, res) => adminController.showDashboard(req, res));

// Users
router.post("/adduser", (req, res) => {
  console.log(" /admin/adduser hit");
  console.log(" Raw body:", req.body);adminController.addUser(req, res);});
  
router.delete("/deleteuser", (req, res) => adminController.deleteUser(req, res));
router.get("/viewusers", (req, res) => adminController.viewUsers(req, res));

// Feedback
router.get("/viewfeedback", (req, res) => adminController.viewFeedback(req, res));

// Requests
router.get("/viewrequests", (req, res) => adminController.viewRequests(req, res));
router.post("/rejectrequest", (req, res) => adminController.rejectRequest(req, res));
router.post("/assignworker", (req, res) => adminController.confirmAssign(req, res));


export default router;
