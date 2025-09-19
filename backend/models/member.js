import User from "./user.js";
import Database from "./database.js";

export default class Member extends User {
    constructor(id, name, email, password, profilePicture, houseNumber, wardNumber) {
        super(id, name, email, password, profilePicture, "Member");
        this.houseNumber = houseNumber;
        this.wardNumber = wardNumber;
    }

    submitWasteRequest(Member_ID, WasteType, HouseNumber, WardNumber, PreferredDateStart, PreferredDateEnd) {
        const sqlRequest = `INSERT INTO wasterequest (Member_ID, WasteType, HouseNumber, WardNumber, PreferredDateStart, PreferredDateEnd, Status, AssignedWorker_ID, ConfirmedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const paramsRequest = [Member_ID, WasteType, HouseNumber, WardNumber, PreferredDateStart, PreferredDateEnd, "Pending", null, null];
        return Database.insert(sqlRequest, paramsRequest);
    }

        submitFeedback(Member_ID, Comments, DateSubmitted) {
        const sqlRequest = `INSERT INTO feedback (Member_ID, Comments, DateSubmitted) VALUES (?, ?, ?)`;
        const paramsRequest = [Member_ID, Comments, DateSubmitted];
        return Database.insert(sqlRequest, paramsRequest);
    }

    deleteWasteRequest(requestId) {
        console.log(`Member ${this.name} deleted request ${requestId}`);
    }

    viewPendingTasks() {
        console.log("Show pending tasks for member.");
    }

    viewRequestStatus(requestId) {
        console.log(`Viewing status for request ${requestId}`);
    }

}
