import Database from "./database.js";


export default class User {
    constructor(id, name, email, password, profilePicture, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password; // hashed in real use
        this.profilePicture = profilePicture;
        this.role = role;
    }


  static async updateMemberProfile( email, name, contact, profilepic, houseName, memberId) {
                const sql = `UPDATE user 
                 JOIN member ON user.User_ID = member.Member_ID
                 SET
                    user.Email = ?,
                    user.Name = ?,
                    user.ContactInfo = ?,
                    user.ProfilePicture = ?,
                    member.HouseName = ?
                 WHERE
                    user.User_ID = ?;`;
                const params = [email, name, contact, profilepic, houseName, memberId];
                return await Database.update(sql, params);
    }

      static async updateWorkerProfile( email, name, contact, profilepic, workerId) {
                const sql = `UPDATE user 
                 SET
                    Email = ?,
                    Name = ?,
                    ContactInfo = ?,
                    ProfilePicture = ?
                 WHERE
                    User_ID = ?;`;
                const params = [email, name, contact, profilepic, workerId];
                return await Database.update(sql, params);
    }

    changePassword(newPassword) {
        this.password = newPassword;
    }

    verifyPassword(inputPassword) {
        return this.password === inputPassword;
    }
}
