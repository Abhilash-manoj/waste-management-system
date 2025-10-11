
import User from "./user.js";
import Database from "./database.js";
import bcrypt from "bcrypt";

export default class Member extends User {
    constructor(id, name, email, password, profilePicture, houseNumber, wardNumber) {
        super(id, name, email, password, profilePicture, "Member");
        this.houseNumber = houseNumber;
        this.wardNumber = wardNumber;
    }


    // Find a member by house number
    static async findByHouseNumber(houseNumber) {
            const sql = `
        SELECT 
            u.User_ID,
            u.Name,
            u.Email,
            u.Password,
            u.ContactInfo,
            u.Role,
            m.HouseNumber,
            m.WardNumber
        FROM Member AS m
        INNER JOIN User AS u ON m.Member_ID = u.User_ID
        WHERE m.HouseNumber = ?
    `;
        const rows = await Database.query(sql, [houseNumber]);
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

    // Insert a new member
    static async insertMember(houseNumber, wardNumber, plainPassword) {
        const hashedPassword = await this.hashPassword(plainPassword);
        const sql = `INSERT INTO member (HouseNumber, WardNumber, Password) VALUES (?, ?, ?)`;
        await Database.insert(sql, [houseNumber, wardNumber, hashedPassword]);
    }

    submitWasteRequest(Member_ID, WasteType, HouseNumber, WardNumber, PreferredDateStart, PreferredDateEnd) {
        const sqlRequest = `INSERT INTO wasterequest (Member_ID, WasteType, HouseNumber, WardNumber, PreferredDateStart, PreferredDateEnd, Status, AssignedWorker_ID, ConfirmedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const paramsRequest = [Member_ID, WasteType, HouseNumber, WardNumber, PreferredDateStart, PreferredDateEnd, "Pending Assignment", null, null];
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
