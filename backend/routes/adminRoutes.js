import express from "express";
import { addUser, deleteUser, showDashboard, viewUsers, viewFeedback, viewRequests, acceptRequest, confirmAssign } from "../controllers/adminController.js";

const router = express.Router();

// GET Admin Dashboard (renders page)
router.get("/admindashboard", showDashboard);

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
