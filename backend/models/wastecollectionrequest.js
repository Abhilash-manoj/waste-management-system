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


        // ➤ view all waste requests (all WasteRequests)
     static async viewRequests() {
        const sql = `SELECT wr.Request_ID, wr.WasteType, wr.Status, 
                            m.HouseNumber, m.WardNumber, u.Name AS MemberName,
                            w.Worker_ID, wu.Name AS WorkerName
                     FROM WasteRequest wr
                     JOIN Member m ON wr.Member_ID = m.Member_ID
                     JOIN User u ON m.Member_ID = u.User_ID
                     LEFT JOIN Worker w ON wr.AssignedWorker_ID = w.Worker_ID
                     LEFT JOIN User wu ON w.Worker_ID = wu.User_ID`;
        return await Database.fetchAll(sql);
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
