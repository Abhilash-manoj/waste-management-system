import bcrypt from "bcrypt";
import Database from "./database.js";



export default class Admin {
      constructor(id, email, password) {
        this.id = id;
        this.email = email;
        this.password = password;  // in real project, hash this
    }
  
        // Find an admin by AdminID
    static async findByAdminId(adminId) {
        const sql = 'SELECT * FROM admin WHERE Admin_ID = ?';
        const rows = await Database.query(sql, [adminId]);
        return rows[0];
    }


    // Find an admin by AdminID
    static async findByEmail(email) {
        const sql = 'SELECT * FROM admin WHERE email = ?';
        const rows = await Database.query(sql, [email]);
        return rows[0];
    }
 // ➤ Add a new user with role handling

async addUser(name, email, password, role, contactInfo, extra = {}) {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert into User table
        const sqlUser = `INSERT INTO User (Name, Email, Password, ContactInfo, Role) 
                         VALUES (?, ?, ?, ?, ?)`;
        const paramsUser = [name, email, hashedPassword, contactInfo, role];
        const userId = await Database.insert(sqlUser, paramsUser);

        console.log(`Added ${role} user with ID:`, userId);

        // Insert into role-specific tables
        if (role === "Member") {
            const wardNumber = extra?.wardNumber || null;
            const houseNumber = extra?.houseNumber || null;
            const sqlMember = `INSERT INTO Member (Member_ID, HouseNumber, WardNumber) 
                               VALUES (?, ?, ?)`;
            const paramsMember = [userId, houseNumber, wardNumber];
            console.log("Inserting Member:", paramsMember);
            await Database.insert(sqlMember, paramsMember);
        }

        if (role === "Worker") {
            const wardNumber = extra?.wardNumber || null;
            const sqlWorker = `INSERT INTO Worker (Worker_ID, WardNumber, taskAssigned) 
                               VALUES (?, ?, ?)`;
            const paramsWorker = [userId, wardNumber, "no"];
            console.log("Inserting Worker:", paramsWorker);
            await Database.insert(sqlWorker, paramsWorker);
        }

        return userId;
    } catch (err) {
        console.error("Error adding user:", err);
        throw err;
    }
}

    // ➤ Delete a user
   async deleteUser(userId) {

    const sqlRole = `SELECT Role FROM User WHERE User_ID = ?`;
    const rows = await Database.query(sqlRole, [userId]);

    if (rows.length === 0) {
        return 0; 
    }

    const role = rows[0].Role;
    console.log("Deleting user:", userId, "Role:", role);

    if (role === "Member") {
        const sqlMember = `DELETE FROM Member WHERE Member_ID = ?`;
        await Database.delete(sqlMember, [userId]);
    }

    if (role === "Worker") {
        const sqlWorker = `DELETE FROM Worker WHERE Worker_ID = ?`;
        await Database.delete(sqlWorker, [userId]);
    }

    const sqlUser = `DELETE FROM User WHERE User_ID = ?`;
    const deleted = await Database.delete(sqlUser, [userId]);

    return deleted; 
}

    // ➤ Search for users (by name/email/role)
    async searchUsers(query) {
        const sql = `SELECT * FROM User 
                     WHERE Name LIKE ? OR Email LIKE ? OR Role LIKE ?`;
        const params = [`%${query}%`, `%${query}%`, `%${query}%`];
        return await Database.fetchAll(sql, params);
    }

    // ➤ View all users
    async viewUsers() {
        const sql = `SELECT 
    u.User_ID,
    u.Name,
    u.Email,
    u.Role,
    COALESCE(m.HouseNumber, NULL) AS HouseNumber,
    COALESCE(m.WardNumber, w.WardNumber) AS WardNumber,
    u.ProfilePicture
FROM User u
LEFT JOIN Member m ON u.User_ID = m.Member_ID
LEFT JOIN Worker w ON u.User_ID = w.Worker_ID;
`;
        return await Database.fetchAll(sql);
    }


    async assignWorker(workerId, requestId) {
        const status = "Assigned";
        const assign = "yes";
        const sqltask = `UPDATE worker SET taskAssigned=? WHERE Worker_ID=?`;
        const paramstask = [assign, workerId];
        const sql = `UPDATE WasteRequest 
                     SET AssignedWorker_ID = ?, Status = ?, lastAssignedWorker_ID = ? 
                     WHERE Request_ID = ?`;
        const params = [workerId, status, workerId, requestId];
        await Database.update(sqltask, paramstask);
        return await Database.update(sql, params);
    }



}