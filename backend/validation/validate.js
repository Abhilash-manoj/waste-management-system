import { body } from "express-validator";

class ValidationRules {
  // ✅ Common reusable field rules
  static common = {
    email: body("email", "Enter a valid email address")
      .isEmail()
      .normalizeEmail(),

    password: body("pass", "Password is required").notEmpty(),

    name: body("name", "Name is required")
      .trim()
      .escape()
      .notEmpty(),

    contactInfo: body("contactInfo", "Enter a valid 10-digit phone number")
      .matches(/^[0-9]{10}$/),

    houseNumber: body("houseNumber", "House number is required")
      .trim()
      .escape()
      .notEmpty(),

    wardNumber: body("wardNumber", "Ward number must be valid")
      .isInt({ min: 1 })
      .toInt(),
  };

  // ✅ Admin/Worker Login
  static loginValidation = [
    this.common.email,
    this.common.password,
  ];

  // ✅ Add User
  static addUserValidation = [
    body("role", "Role must be either Worker or Member")
      .notEmpty()
      .isIn(["Worker", "Member"]),

    this.common.name,
    body("password", "Password must be at least 6 characters long")
      .isLength({ min: 6 }),
    this.common.contactInfo,

    // Conditional validation for extra details
    body().custom((value, { req }) => {
      const { role, extra } = req.body;
      if (!extra) throw new Error("Missing extra details.");

      if (role === "Worker" && !extra.wardNumber)
        throw new Error("Worker must have a valid ward number.");

      if (role === "Member") {
        if (!extra.houseNumber)
          throw new Error("Member must have a house number.");
        if (!extra.wardNumber)
          throw new Error("Member must have a ward number.");
      }

      return true;
    }),
  ];

  // ✅ Member Login
  static memberLoginValidation = [
    body("wardnumber", "Ward number must be a valid integer")
      .isInt({ min: 1 })
      .toInt(),
    body("housenumber", "House number is required")
      .trim()
      .escape()
      .notEmpty(),
    this.common.password,
  ];

  // ✅ Waste Request
  static wasteRequestValidation = [
    body("wasteType", "Waste type is required")
      .trim()
      .escape()
      .notEmpty(),
    body("preferredDateStart", "Enter a valid start date").isISO8601(),
    body("preferredDateEnd", "Enter a valid end date").isISO8601(),
    this.common.houseNumber,
    this.common.wardNumber,

    // Logical validation: end date after start date
    body().custom((value, { req }) => {
      const { preferredDateStart, preferredDateEnd } = req.body;
      if (
        new Date(preferredDateEnd).getTime() <
        new Date(preferredDateStart).getTime()
      ) {
        throw new Error("End date must be after start date.");
      }
      return true;
    }),
  ];

  // ✅ Feedback
  static feedbackValidation = [
    body("memberId", "Valid member ID is required").isInt().toInt(),
    body("comment", "Feedback comment cannot be empty")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ max: 300 })
      .withMessage("Feedback comment too long."),
    body("datesubmitted", "Provide a valid date").isISO8601(),
  ];
}

export default ValidationRules;
