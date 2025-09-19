
import Database from "./database.js";



export default class Admin {
      constructor(id, email, password) {
        this.id = id;
        this.email = email;
        this.password = password;  // in real project, hash this
    }
 // ➤ Add a new user with role handling
    async addUser(name, email, password, role, profilePicture = null, extra = {}) {
        const sqlUser = `INSERT INTO User (Name, Email, Password, Role, ProfilePicture) 
                         VALUES (?, ?, ?, ?, ?)`;
        const paramsUser = [name, email, password, role, profilePicture];
        const userId = await Database.insert(sqlUser, paramsUser);

        if (role === "Member") {
            const sqlMember = `INSERT INTO Member (Member_ID, HouseNumber, WardNumber) 
                               VALUES (?, ?, ?)`;
            const paramsMember = [userId, extra.houseNumber, extra.wardNumber];
            console.log("Inserting Member:", userId, extra.houseNumber, extra.wardNumber);
            await Database.insert(sqlMember, paramsMember);
        }

        if (role === "Worker") {
            const sqlWorker = `INSERT INTO Worker (Worker_ID, TaskCount) 
                               VALUES (?, ?)`;
            const paramsWorker = [userId, extra.taskCount || 0];
            await Database.insert(sqlWorker, paramsWorker);
        }

        return userId;
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
        const sql = `SELECT User_ID, Name, Email, Role FROM User`;
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