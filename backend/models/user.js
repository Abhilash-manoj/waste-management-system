import Database from "./database.js";
import bcrypt from "bcrypt";


export default class User {
    constructor(id, name, email, password, profilePicture, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
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
 async addUser(name, email, password, role, contactInfo, extra = {}) {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔍 Check for duplicates before inserting
    if (role === "Member") {
      const checkDuplicate = `
        SELECT m.Member_ID 
        FROM Member m
        JOIN User u ON m.Member_ID = u.User_ID
        WHERE m.HouseNumber = ? OR u.ContactInfo = ?
      `;
      const duplicates = await Database.query(checkDuplicate, [
        extra.houseNumber,
        contactInfo,
      ]);

      if (duplicates.length > 0) {
        throw new Error("House number or contact info already exists for another member.");
      }
    } else if (role === "Worker") {
      const checkDuplicate = `
        SELECT u.User_ID 
        FROM User u
        WHERE u.ContactInfo = ?
      `;
      const duplicates = await Database.query(checkDuplicate, [contactInfo]);
      if (duplicates.length > 0) {
        throw new Error("Contact info already exists for another worker.");
      }
    }

    
    const sqlUser = `
      INSERT INTO User (Name, Email, Password, ContactInfo, Role)
      VALUES (?, ?, ?, ?, ?)
    `;
    const paramsUser = [name, email, hashedPassword, contactInfo, role];
    const userId = await Database.insert(sqlUser, paramsUser);

    console.log(`✅ Added ${role} user with ID:`, userId);

    // ✅ Insert into role-specific tables
    if (role === "Member") {
      const wardNumber = extra?.wardNumber || null;
      const houseNumber = extra?.houseNumber || null;

      try {
        const sqlMember = `
          INSERT INTO Member (Member_ID, HouseNumber, WardNumber)
          VALUES (?, ?, ?)
        `;
        const paramsMember = [userId, houseNumber, wardNumber];
        await Database.insert(sqlMember, paramsMember);
      } catch (err) {
        // Rollback user record
        await Database.delete(`DELETE FROM User WHERE User_ID = ?`, [userId]);
        throw new Error("Failed to add member. The house number might already exist.");
      }
    }

    if (role === "Worker") {
      const wardNumber = extra?.wardNumber || null;
      try {
        const sqlWorker = `
          INSERT INTO Worker (Worker_ID, WardNumber, taskAssigned)
          VALUES (?, ?, ?)
        `;
        const paramsWorker = [userId, wardNumber, "no"];
        await Database.insert(sqlWorker, paramsWorker);
      } catch (err) {
        // Rollback user record
        await Database.delete(`DELETE FROM User WHERE User_ID = ?`, [userId]);
        throw new Error("Failed to add worker. Contact info may already exist.");
      }
    }

    return userId;
  } catch (err) {
    // ❌ Send the actual message to be handled by controller
    throw new Error(err.message || "Error adding user.");
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

async changePassword(userId, currentPassword, newPassword) {
  try {
    // Fetch current password hash
    const sql = "SELECT Password FROM User WHERE User_ID = ?";
    const rows = await Database.query(sql, [userId]);

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const valid = await bcrypt.compare(currentPassword, rows[0].Password);
    if (!valid) return false;

    // Hash new password and update
    const hashed = await bcrypt.hash(newPassword, 10);
    const updateSql = "UPDATE User SET Password = ? WHERE User_ID = ?";
    await Database.update(updateSql, [hashed, userId]);

    console.log(`✅ Password updated for User_ID: ${userId}`);
    return true;
  } catch (err) {
    console.error("❌ Error in changePassword:", err);
    throw err;
  }
}

};
