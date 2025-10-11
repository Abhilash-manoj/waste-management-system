import express from "express";
import Worker from "../models/worker.js";
import WorkerController from "../controllers/workerController.js";

const router = express.Router();
const workerModel = Worker;
const workerController = new WorkerController(workerModel);

// Worker login routes
router.get("/workerlogin", (req, res) => workerController.renderLoginPage(req, res));
router.post("/workerlogin", (req, res) => workerController.login(req, res));
router.get("/workerdashboard", (req, res) => workerController.renderDashboard(req, res)); // fixed method name

// GET Worker Dashboard (old version)
router.get("/workerdashboard-old", (req, res) => workerController.showDashboard(req, res)); // kept for old dashboard

// Get available workers
router.post("/available-workers", (req, res) => workerController.getAvailableWorkers(req, res));

// Accept task
router.post("/accept-task", (req, res) => workerController.confirmTaskDate(req, res));

// Get dates
router.post("/get-dates", (req, res) => workerController.getDates(req, res));

// Complete task
router.post("/complete-task", (req, res) => workerController.completeTask(req, res));

// View requests
router.get("/view-requests", (req, res) => workerController.viewRequests(req, res));

// Assign worker to request
router.post("/reassign-worker", (req, res) => workerController.reassignWorker(req, res));

export default router;
