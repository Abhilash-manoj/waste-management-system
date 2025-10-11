import Database from "./database.js";

export default class WasteRequest {
    constructor(requestId, memberId, wasteType, houseNumber, wardNumber, preferredDateRange, status = "Pending", assignedWorkerId = null, confirmedDate = null) {
        this.requestId = requestId;
        this.memberId = memberId;
        this.wasteType = wasteType;
        this.houseNumber = houseNumber;
        this.wardNumber = wardNumber;
        this.preferredDateRange = preferredDateRange;
        this.status = status;
        this.assignedWorkerId = assignedWorkerId;
        this.confirmedDate = confirmedDate;
    }


        static async findByRequestId(requestId) {
            const sql = `SELECT * FROM wasterequest WHERE Request_ID = ? `;
            const rows = await Database.query(sql, [requestId]);
            return rows[0];
        }

// ➤ View waste requests based on role
static async viewRequests(userId, role = null) {
    let sql;
    let params = [];

    if (role === "member") {
        // Member: show only their own requests
        sql = `
            SELECT wr.Request_ID, wr.WasteType, wr.Status,
                   m.HouseNumber, m.WardNumber, u.Name AS MemberName,
                   w.Worker_ID, wu.Name AS WorkerName
            FROM WasteRequest wr
            JOIN Member m ON wr.Member_ID = m.Member_ID
            JOIN User u ON m.Member_ID = u.User_ID
            LEFT JOIN Worker w ON wr.AssignedWorker_ID = w.Worker_ID
            LEFT JOIN User wu ON w.Worker_ID = wu.User_ID
            WHERE m.Member_ID = ?;
        `;
        params = [userId];
    } 
    else if (role === "worker") {
        // Worker: show only requests assigned to them
        sql = `
            SELECT wr.Request_ID, wr.WasteType, wr.Status,
                   m.HouseNumber, m.WardNumber, u.Name AS MemberName,
                   w.Worker_ID, wu.Name AS WorkerName
            FROM WasteRequest wr
            JOIN Member m ON wr.Member_ID = m.Member_ID
            JOIN User u ON m.Member_ID = u.User_ID
            LEFT JOIN Worker w ON wr.AssignedWorker_ID = w.Worker_ID
            LEFT JOIN User wu ON w.Worker_ID = wu.User_ID
            WHERE wr.AssignedWorker_ID = ?;
        `;
        params = [userId];
    } 
    else {
        // Admin (or unspecified role): show all requests
        sql = `
            SELECT wr.Request_ID, wr.WasteType, wr.Status,
                   m.HouseNumber, m.WardNumber, u.Name AS MemberName,
                   w.Worker_ID, wu.Name AS WorkerName
            FROM WasteRequest wr
            JOIN Member m ON wr.Member_ID = m.Member_ID
            JOIN User u ON m.Member_ID = u.User_ID
            LEFT JOIN Worker w ON wr.AssignedWorker_ID = w.Worker_ID
            LEFT JOIN User wu ON w.Worker_ID = wu.User_ID;
        `;
    }

    return await Database.fetchAll(sql, params);
}



     static async updateStatus(newStatus, requestId) {
       const sql = ` UPDATE WasteRequest SET Status = ? WHERE Request_ID = ? `;
       const paramsRequest = [newStatus, requestId];
        return Database.update(sql, paramsRequest);
    }

    static async updateDate(selectedDate, requestId) {
       const sql = ` UPDATE WasteRequest SET ConfirmedDate = ?, Status = ? WHERE Request_ID = ? `;
       const paramsRequest = [selectedDate, "Accepted", requestId];
        return Database.update(sql, paramsRequest);
    }



     static async getDates(requestId) {
       const sql = `SELECT PreferredDateStart, PreferredDateEnd FROM wasterequest WHERE Request_ID = ?`;
       const paramsRequest = [requestId];
       return Database.fetchAll(sql, paramsRequest);
    }

    assignWorker(workerId) {
        this.assignedWorkerId = workerId;
    }
}
