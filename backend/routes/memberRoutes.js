import express from "express";
import multer from "multer"; 
import path from "path";     
import Member from "../models/member.js";
import MemberController from "../controllers/memberController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import ValidationRules from "../validation/validate.js"; 

const router = express.Router();
const memberModel = Member;
const memberController = new MemberController(memberModel);

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
// ------------------------------

// ✅ Member login routes
router.get("/memberlogin", (req, res) => memberController.renderLoginPage(req, res));
router.post(
  "/memberlogin",
  ValidationRules.memberLoginValidation,
  validateRequest,
  (req, res) => memberController.login(req, res)
);

// ✅ Member dashboard
router.get("/memberdashboard", (req, res) => memberController.renderDashboard(req, res));

router.get("/memberEditProfile", (req, res) => memberController.memberEditProfile(req, res));

router.post(
  "/updateProfile",
  uploadWithErrorHandler,
  (req, res) => memberController.updateProfile(req, res)
);

router.post("/changePassword", memberController.changePassword);

// ✅ Submit waste request
router.post(
  "/submitrequest",
  ValidationRules.wasteRequestValidation, 
  validateRequest,
  (req, res) => memberController.submitWasteRequest(req, res)
);

// Delete waste Request
router.delete("/deleterequest/:id", (req, res) => memberController.deleteWasteRequest(req, res));


// ✅ View waste requests
router.get("/viewrequests", (req, res) => memberController.viewRequests(req, res));

// ✅ Submit feedback
router.post(
  "/submitfeedback",
  ValidationRules.feedbackValidation, 
  validateRequest,
  (req, res) => memberController.submitFeedback(req, res)
);

// ✅ View feedback
router.get("/viewfeedback", (req, res) => memberController.viewFeedback(req, res));

export default router;

