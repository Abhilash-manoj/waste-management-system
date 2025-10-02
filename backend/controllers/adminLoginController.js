import path from 'path';
import bcrypt from 'bcrypt';

class AdminLoginController {
  constructor(adminModel) {
    this.adminModel = adminModel;
  }

  renderLoginPage(req, res) {
    res.render('adminLogin'); // Renders views/adminLogin.ejs
  }

  async login(req, res) {
    const { admin, pass } = req.body;

    if (!admin || pass.length < 6) {
      return res.render('adminLogin', {
        error: 'Admin ID cannot be empty and password must be at least 6 characters.'
      });
    }

    const adminData = await this.adminModel.findByAdminId(admin);
    if (!adminData) {
      return res.render('adminLogin', {
        error: 'Invalid Admin ID or password.'
      });
    }

    const match = await bcrypt.compare(pass, adminData.Password);
    if (!match) {
      return res.render('adminLogin', {
        error: 'Invalid Admin ID or password.'
      });
    }

    req.session.admin = admin;
    res.redirect('/admindashboard');
  }

  renderDashboard(req, res) {
    if (!req.session.admin) {
      return res.redirect('/adminlogin');
    }

    res.render('adminDashboard', {
      adminId: req.session.admin
    });
  }
}

export default AdminLoginController;