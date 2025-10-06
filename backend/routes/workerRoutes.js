
import express from "express";
import { getAvailableWorkers, reassignWorker, showDashboard, viewRequests, getDates, confirmTaskDate, completeTask } from "../controllers/workerController.js";
import Worker from '../models/worker.js';
import WorkerLoginController from '../controllers/workerLoginController.js';

const router = express.Router();
const workerModel = Worker;
const workerController = new WorkerLoginController(workerModel);



// Worker login routes
router.get('/workerlogin', (req, res) => workerController.renderLoginPage(req, res));
router.post('/worker/login', (req, res) => workerController.login(req, res));
router.get('/workerdashboard', (req, res) => workerController.renderDashboard(req, res));

// GET Worker Dashboard (renders page)
router.get("/workerdashboard-old", showDashboard); // keep old dashboard route if needed


//get available workers
router.post("/available-workers", getAvailableWorkers);

//get available workers
router.post("/accept-task", confirmTaskDate );

//get-dates
router.post("/get-dates", getDates);

//get available workers
router.post("/complete-task", completeTask );

// View Requests
router.get("/view-requests", viewRequests);


//Asign worker to request
router.post("/reassign-worker", reassignWorker);

export default router;
