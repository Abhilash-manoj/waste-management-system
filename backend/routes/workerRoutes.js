import express from "express";
import Worker from "../models/worker.js";
import WorkerController from "../controllers/workerController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import ValidationRules from "../validation/validate.js"; // ✅ Import validation class

const router = express.Router();
const workerModel = Worker;
const workerController = new WorkerController(workerModel);

// ✅ Worker login routes
router.get("/workerlogin", (req, res) => workerController.renderLoginPage(req, res));
router.post(
  "/workerlogin",
  ValidationRules.loginValidation, // ✅ fixed reference
  validateRequest,
  (req, res) => workerController.login(req, res)
);

// ✅ Worker dashboard
router.get("/workerdashboard", (req, res) => workerController.renderDashboard(req, res));

// ✅ Old dashboard route (optional)
router.get("/workerdashboard-old", (req, res) => workerController.showDashboard(req, res));

// ✅ Get available workers
router.post("/available-workers", (req, res) => workerController.getAvailableWorkers(req, res));

// ✅ Accept task
router.post("/accept-task", (req, res) => workerController.confirmTaskDate(req, res));

// ✅ Get task dates
router.post("/get-dates", (req, res) => workerController.getDates(req, res));

// ✅ Complete task
router.post("/complete-task", (req, res) => workerController.completeTask(req, res));

// ✅ View assigned requests
router.get("/view-requests", (req, res) => workerController.viewRequests(req, res));

// ✅ Reassign worker
router.post("/reassign-worker", (req, res) => workerController.reassignWorker(req, res));

export default router;
