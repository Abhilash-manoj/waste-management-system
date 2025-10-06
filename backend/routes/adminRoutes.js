import express from "express";
import { addUser, deleteUser, showDashboard, viewUsers, viewFeedback, viewRequests, acceptRequest, confirmAssign } from "../controllers/adminController.js";
import Admin from '../models/admin.js';
import AdminController from '../controllers/adminLoginController.js';

const router = express.Router();
const adminModel = Admin;
const adminController = new AdminController(adminModel);

// Admin login routes
router.get('/adminlogin', (req, res) => adminController.renderLoginPage(req, res));
router.post('/adminlogin', (req, res) => adminController.login(req, res));
router.get('/admindashboard', (req, res) => adminController.renderDashboard(req, res));

// GET Admin Dashboard (renders page)
router.get("/admindashboard-old", showDashboard); // keep old dashboard route if needed

// POST Add User (form submit)
router.post("/add-user", addUser);

// POST Delete User (form submit)
router.post("/delete-user", deleteUser);

// POST update status (form submit)
router.post("/accept-request", acceptRequest);

//Asign worker to request
router.post("/assign-worker", confirmAssign);

// View all users
router.get("/view-users", viewUsers);

// View all feedback
router.get("/view-feedback", viewFeedback);

// View all feedback
router.get("/view-requests", viewRequests);

export default router;
