import Database from "./database.js";


export default class Feedback {
    constructor(feedbackId, requestId, memberId, comments, dateSubmitted = new Date()) {
        this.feedbackId = feedbackId;
        this.requestId = requestId;
        this.memberId = memberId;
        this.comments = comments;
        this.dateSubmitted = dateSubmitted;
    }

   static async submitFeedback(Member_ID, Comments, DateSubmitted) {
        const sqlRequest = `INSERT INTO feedback (Member_ID, Comments, DateSubmitted) VALUES (?, ?, ?)`;
        const paramsRequest = [Member_ID, Comments, DateSubmitted];
        return Database.insert(sqlRequest, paramsRequest);
    }


static async viewFeedback(memberId) {
 
    let sql;
if (memberId) {
    sql = `
        SELECT 
            f.Feedback_ID,
            f.Comments,
            DATE_FORMAT(f.DateSubmitted, '%Y-%m-%d %H:%i') AS DateSubmitted,
            u.Name AS MemberName
        FROM Feedback f
        INNER JOIN Member m ON f.Member_ID = m.Member_ID
        INNER JOIN User u ON m.Member_ID = u.User_ID
        WHERE m.Member_ID = ?
        ORDER BY f.DateSubmitted DESC;
    `;
} else {
    // All feedback
    sql = `
        SELECT 
            f.Feedback_ID,
            f.Comments,
            DATE_FORMAT(f.DateSubmitted, '%Y-%m-%d %H:%i') AS DateSubmitted,
            u.Name AS MemberName
        FROM Feedback f
        INNER JOIN Member m ON f.Member_ID = m.Member_ID
        INNER JOIN User u ON m.Member_ID = u.User_ID
        ORDER BY f.DateSubmitted DESC;
    `;
}

    return await Database.fetchAll(sql, [memberId]);
}
}
