import User from "./user.js";
import Database from "./database.js";

export default class Worker extends User {
    constructor(id, name, email, password, profilePicture, taskCount = 0) {
        super(id, name, email, password, profilePicture, "Worker");
        this.taskCount = taskCount;
    }


    static async getAvailable(requestId) {
        const sql =  `
        SELECT * 
        FROM worker 
        WHERE taskAssigned = 'no' 
        AND (
            Worker_ID != (
                SELECT LastAssignedWorker_ID 
                FROM WasteRequest 
                WHERE Request_ID = ?
            ) 
            OR (
                SELECT LastAssignedWorker_ID 
                FROM WasteRequest 
                WHERE Request_ID = ?
            ) IS NULL
        )
    `;
       const params = [requestId , requestId];
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
