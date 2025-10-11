
import User from "./user.js";
import Database from "./database.js";
import bcrypt from "bcrypt";

export default class Worker extends User {
    constructor(id, name, email, password, profilePicture, taskCount = 0) {
        super(id, name, email, password, profilePicture, "Worker");
        this.taskCount = taskCount;
    }

    // Find a worker by WorkerID
   static async findByWorkerId(workerId) {
    const sql = `
        SELECT 
            u.User_ID,
            u.Name,
            u.Email,
            u.Password,
            u.ContactInfo,
            u.Role,
            w.Worker_ID,
            w.WardNumber
        FROM Worker AS w
        INNER JOIN User AS u ON w.Worker_ID = u.User_ID
        WHERE w.Worker_ID = ?
    `;
    const rows = await Database.query(sql, [workerId]);
    return rows[0];
}


    // Verify password using bcrypt
    static async verifyPassword(inputPassword, storedHash) {
        return bcrypt.compare(inputPassword, storedHash);
    }

    // Hash password using bcrypt
    static async hashPassword(plainPassword) {
        const saltRounds = 10;
        return bcrypt.hash(plainPassword, saltRounds);
    }

    // Insert a new worker
    static async insertWorker(workerId, wardNumber, plainPassword) {
        const hashedPassword = await this.hashPassword(plainPassword);
        const sql = `INSERT INTO worker (WorkerID, WardNumber, Password) VALUES (?, ?, ?)`;
        await Database.insert(sql, [workerId, wardNumber, hashedPassword]);
    }


    static async getAvailable(requestId) {
  const sql = `
    SELECT 
      w.Worker_ID,
      u.Name AS Worker_Name,
      w.WardNumber,
      w.TaskAssigned
    FROM Worker w
    INNER JOIN User u ON w.Worker_ID = u.User_ID
    WHERE w.TaskAssigned = 'no'
    AND (
      w.Worker_ID != (
        SELECT LastAssignedWorker_ID 
        FROM WasteRequest 
        WHERE Request_ID = ? 
        LIMIT 1
      )
      OR (
        SELECT LastAssignedWorker_ID 
        FROM WasteRequest 
        WHERE Request_ID = ? 
        LIMIT 1
      ) IS NULL
    )
  `;
  const params = [requestId, requestId];
  return await Database.fetchAll(sql, params);
}



    static async requestReassignment(newStatus, requestId, workerId) {
            const newworkerId = null;
            const assign = "no";
            const paramstask = [assign, workerId];

            const sqltask = `UPDATE worker SET taskAssigned=? WHERE Worker_ID=?`;
            const sql = `UPDATE WasteRequest 
                         SET AssignedWorker_ID = ?, Status = ? 
                         WHERE Request_ID = ?`;
            const params = [newworkerId, newStatus, requestId];
            await Database.update(sqltask, paramstask);
            return await Database.update(sql, params);
        }


    static async markTaskCompleted(workerId) {
        const assign = "no";
        const sqltask = `UPDATE worker SET taskAssigned=? WHERE Worker_ID=?`;
        const paramstask = [assign, workerId];
        return await Database.update(sqltask, paramstask);
    }
}
