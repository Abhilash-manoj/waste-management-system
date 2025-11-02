import express from "express";
import Worker from "../models/worker.js";
import multer from "multer"; 
import path from "path";     
import WorkerController from "../controllers/workerController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import ValidationRules from "../validation/validate.js"; // ✅ Import validation class

const router = express.Router();
const workerModel = Worker;
const workerController = new WorkerController(workerModel);



// 3. Multer Setup
// --- Multer Setup ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // This folder MUST exist: {project_root}/public/uploads/profile_pics
    cb(null, 'public/uploads/profile_pics'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// This line defines the 'upload' variable
const upload = multer({ storage: storage });
// --------------------

// 4. Multer Error Handler
// This function MUST be in the same file as the 'upload' variable
const uploadWithErrorHandler = (req, res, next) => {
  const uploadMiddleware = upload.single("profilePicture"); // "profilePicture" must match the 'name' in your EJS

  uploadMiddleware(req, res, (err) => {
    if (err) {
      // This will catch any error from multer (e.g., directory not found)
      console.error("---!! MULTER ERROR !! ---:", err);
      return res.status(500).json({ 
        message: "File upload failed. Check server logs.",
        error: err.message 
      });
    }
    // Success! 'req.file' and 'req.body' are now created.
    next();
  });
};

// ✅ Worker login routes
router.get("/workerlogin", (req, res) => workerController.renderLoginPage(req, res));
router.post(
  "/workerlogin",
  ValidationRules.loginValidation, // ✅ fixed reference
  validateRequest,
  (req, res) => workerController.login(req, res)
);

//  Worker dashboard
router.get("/workerdashboard", (req, res) => workerController.renderDashboard(req, res));

router.get("/workerEditProfile", (req, res) => workerController.workerEditProfile(req, res));

router.post(
  "/updateProfile",
  uploadWithErrorHandler,
  (req, res) => workerController.updateProfile(req, res)
);

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
