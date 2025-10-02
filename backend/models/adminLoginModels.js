import db from '../config/db.js';

class AdminModel {
  async findByAdminId(adminId) {
    const [rows] = await db.query('SELECT * FROM admin WHERE AdminID = ?', [adminId]);
    return rows[0];
  }
}

export default AdminModel;