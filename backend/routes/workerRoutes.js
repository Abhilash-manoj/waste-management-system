
import express from "express";
import { getAvailableWorkers, reassignWorker, showDashboard, viewRequests, getDates, confirmTaskDate, completeTask } from "../controllers/workerController.js";

const router = express.Router();



// GET Worker Dashboard (renders page)
router.get("/workerdashboard", showDashboard);


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
