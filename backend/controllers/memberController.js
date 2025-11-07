import Member from "../models/member.js";
import Feedback from "../models/feedback.js";
import WasteRequest from "../models/wastecollectionrequest.js";
import User from "../models/user.js";

class MemberController {
   constructor(memberModel) {
    this.memberModel = memberModel;
  }
  
  validateInput(houseNumber, wardNumber, password) {
    const houseRegex = /^[A-Za-z0-9\-\/]+$/;
    const wardRegex = /^\d+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    return (
      houseRegex.test(houseNumber) &&
      wardRegex.test(wardNumber) &&
      passRegex.test(password)
    );
  }

  renderLoginPage(req, res) {
    res.render('memberLogin');
  }

  async login(req, res) {
  const { housenumber, wardnumber, pass } = req.body;

  if (!this.validateInput(housenumber, wardnumber, pass)) {
    return res.render('memberLogin', { error: 'Invalid input format.' });
  }

  try {
    const member = await this.memberModel.findByHouseNumber(housenumber);

    if (!member || String(member.WardNumber) !== String(wardnumber)) {
      return res.render('memberLogin', { error: 'Invalid Username and Password!!!' });
    }

    const isValid = await this.memberModel.verifyPassword(pass, member.Password);
    if (!isValid) {
      return res.render('memberLogin', { error: 'Invalid Username and Password!!!' });
    }

    req.session.member = {
      id: member.User_ID,
      name: member.Name,
      email: member.Email,
      contactInfo: member.ContactInfo,
      role: member.Role,
      houseNumber: member.HouseNumber,
      wardNumber: member.WardNumber,
      houseName: member.HouseName,
      profilePicture: member.ProfilePicture
    };

    res.redirect('/member/memberdashboard');
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).send('Server error');
  }
}


  renderDashboard(req, res) {
    if (!req.session.member) {
      return res.redirect('/member/memberlogin');
    }
    console.log("Rendering dashboard for member:", req.session.member);
    res.render('memberDashboard', {
      session: req.session
    });
  }

  // Render Member Edit Profile
  memberEditProfile(req, res) {

      if (!req.session.member) {
      return res.redirect('/member/memberlogin');
    }

    res.render("memberEditProfile", { session: req.session });
  }

  // Submit a waste collection request
  async submitWasteRequest(req, res) {
    const { memberId, wasteType, houseNumber, wardNumber, preferredDateStart, preferredDateEnd } = req.body;

    try {
      const sessionMember = req.session?.member;

      const member = new Member(
        sessionMember?.id || 1,
        sessionMember?.name || "SuperAdmin",
        sessionMember?.email || "admin@example.com",
        "hashedPass",
        null,
        sessionMember?.houseNumber || houseNumber,
        sessionMember?.wardNumber || wardNumber
      );

      const requestId = await member.submitWasteRequest(
        memberId,
        wasteType,
        houseNumber,
        wardNumber,
        preferredDateStart,
        preferredDateEnd
      );

      res.json({ success: true, message: `Request submitted with ID: ${requestId}`, requestId });
    } catch (err) {
      console.error("❌ Error submitting request:", err.message);
      res.status(500).json({ success: false, message: "Error submitting request. Try again." });
    }
  }

   async viewRequests(req, res) {
        try {
            // Get memberId from session (or hidden field)
            const memberId = req.session.member?.id;

            if (!memberId) {
                return res.status(400).json({ error: "Member ID not found in session" });
            }

            // Call model function to fetch requests
            const requests = await WasteRequest.viewRequests(memberId, "member");

            return res.status(200).json({ data: requests });
        } catch (err) {
            console.error("❌ Error fetching member requests:", err);
            return res.status(500).json({ error: "Server error" });
        }
    }

  // Submit feedback
  async submitFeedback(req, res) {
    const { memberId, comment, datesubmitted } = req.body;

    try {
      const feedbackId = await Feedback.submitFeedback(memberId, comment, datesubmitted);

      res.json({ success: true, message: `Feedback submitted with ID: ${feedbackId}`, feedbackId });
    } catch (err) {
      console.error("❌ Error submitting feedback:", err.message);
      res.status(500).json({ success: false, message: "Error submitting feedback. Try again." });
    }
  }

    
  async updateProfile(req, res) {
    try {

    const {
        fullName,
        contactInfo,
        houseName,
        email,
        userId = req.session?.member?.id || req.body.memberId 
      } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "You must be logged in to update a profile." });
      }


      let profilePicPath = req.session.member.profilePicture; 
      if (req.file) {
        profilePicPath = req.file.path.replace('public', '').replace(/\\/g, '/');
      }

            await User.updateMemberProfile(
        email,
        fullName,
        contactInfo,
        profilePicPath,
        houseName,
         userId
      );
      console.log("member Profile is:",profilePicPath);
     
      req.session.member.name = fullName;
      req.session.member.email = email;
      req.session.member.contact = contactInfo;
      req.session.member.houseName = houseName;
      req.session.member.profilePicture = profilePicPath;

      res.status(200).json({ message: "Profile updated successfully!" });

    } catch (error) {
      console.error("Error in updateProfile controller:", error);
      res.status(500).json({ message: "An error occurred while updating the profile." });
    }
  }

  async changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const memberId = req.session?.member?.id || req.body.memberId

    if (!memberId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Call the model function to update password
    const member = new User();
    const success = await member.changePassword(memberId, currentPassword, newPassword);

    if (success) {
      res.json({
        success: true,
        message: "Password updated successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }
  } catch (err) {
    console.error("❌ Error changing password:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


  // View feedback (for member dashboard)
  async viewFeedback(req, res) {
    try {
      const memberId = req.session.member?.id;
      const feedback = await Feedback.viewFeedback(memberId);
      console.log("Loaded feedback:", feedback);

      res.json({ success: true, data: feedback });
    } catch (err) {
      console.error("❌ Error fetching feedback:", err.message);
      res.status(500).json({ success: false, message: "Failed to load feedback." });
    }
  }
}

export default MemberController;
