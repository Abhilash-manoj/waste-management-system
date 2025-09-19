import pool from "../config/db.js";

export default class Database {
    static async connect()  {
  try {
    const connection = await pool.getConnection(); 
    console.log('✅ MySQL connection successful!');
    connection.release(); 
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
  }
}
  // 🔹 Generic query
  static async query(sql, params = []) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error("❌ Database Query Error:", error.message);
      throw error;
    }
  }

  // 🔹 Insert data
  static async insert(sql, params = []) {
    try {
      const [result] = await pool.query(sql, params);
      return result.insertId; // return ID of inserted row
    } catch (error) {
      console.error("❌ Insert Error:", error.message);
      throw error;
    }
  }

  // 🔹 Update data
  static async update(sql, params = []) {
    try {
      const [result] = await pool.query(sql, params);
      return result.affectedRows; // number of updated rows
    } catch (error) {
      console.error("❌ Update Error:", error.message);
      throw error;
    }
  }

  // 🔹 Delete data
  static async delete(sql, params = []) {
    try {
      const [result] = await pool.query(sql, params);
      return result.affectedRows; // number of deleted rows
    } catch (error) {
      console.error("❌ Delete Error:", error.message);
      throw error;
    }
  }

  // 🔹 Fetch single record
  static async fetchOne(sql, params = []) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ FetchOne Error:", error.message);
      throw error;
    }
  }

  // 🔹 Fetch all records
  static async fetchAll(sql, params = []) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error("❌ FetchAll Error:", error.message);
      throw error;
    }
  }
}