import bcrypt from 'bcrypt';
import db from '../config/db.js';

class MemberModel {
  constructor() {
    this.db = db;
    this.table = 'member';
  }

  async findByHouseNumber(houseNumber) {
    const [rows] = await this.db.query(
      `SELECT * FROM ${this.table} WHERE HouseNumber = ?`,
      [houseNumber]
    );
    return rows[0];
  }

  async verifyPassword(inputPassword, storedHash) {
    return bcrypt.compare(inputPassword, storedHash);
  }

  async hashPassword(plainPassword) {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
  }

  async insertMember(houseNumber, wardNumber, plainPassword) {
    const hashedPassword = await this.hashPassword(plainPassword);
    await this.db.query(
      `INSERT INTO ${this.table} (HouseNumber, WardNumber, Password) VALUES (?, ?, ?)`,
      [houseNumber, wardNumber, hashedPassword]
    );
  }
}

export default MemberModel;