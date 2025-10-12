import { body } from "express-validator";



export const addUserValidation = [
  body("role")
    .notEmpty()
    .isIn(["Worker", "Member"])
    .withMessage("Role must be either Worker or Member."),

  // ✅ Common fields for both
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("contactInfo")
    .matches(/^[0-9]{10}$/)
    .withMessage("Enter a valid 10-digit phone number."),

  // ✅ Conditional validation based on role
  body().custom((value, { req }) => {
    const { role, extra } = req.body;

    if (!extra) {
      throw new Error("Missing extra details.");
    }

    if (role === "Worker") {
      if (!extra.wardNumber)
        throw new Error("Worker must have a valid ward number.");
    }

    if (role === "Member") {
      if (!extra.houseNumber)
        throw new Error("Member must have a house number.");
      if (!extra.wardNumber)
        throw new Error("Member must have a ward number.");
    }

    return true;
  })];

export const loginValidation = [
 body("email").isEmail().withMessage("Enter a valid email address."),
  body("pass").notEmpty().withMessage("Password is required."),
];

export const memberLoginValidation = [
    body("wardnumber")
    .isInt({ min: 1 })
    .withMessage("Ward number must be a valid integer."),
  body("housenumber").trim().notEmpty().withMessage("House number is required."),
  body("pass").notEmpty().withMessage("Password is required."),
];

// ✅ 2. Waste Request
export const wasteRequestValidation = [
  body("wasteType").notEmpty().withMessage("Waste type is required."),
  body("preferredDateStart")
    .isISO8601()
    .withMessage("Enter a valid start date."),
  body("preferredDateEnd")
    .isISO8601()
    .withMessage("Enter a valid end date."),
  body("houseNumber").trim().notEmpty().withMessage("House number is required."),
  body("wardNumber")
    .isInt({ min: 1 })
    .withMessage("Ward number must be valid."),
];



// ✅ 4. Feedback
export const feedbackValidation = [
  body("memberId").isInt().withMessage("Valid member ID is required."),
  body("comment")
    .notEmpty()
    .withMessage("Feedback comment cannot be empty.")
    .isLength({ max: 300 })
    .withMessage("Feedback comment too long."),
  body("datesubmitted")
    .isISO8601()
    .withMessage("Provide a valid date."),
];

