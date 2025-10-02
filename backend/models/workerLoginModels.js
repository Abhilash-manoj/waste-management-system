import bcrypt from 'bcrypt';
import db from '../config/db.js';

class WorkerModel {
  constructor() {
    this.table = 'worker';
  }

  async findByWorkerId(workerId) {
    const [rows] = await db.query(
      `SELECT * FROM ${this.table} WHERE WorkerID = ?`,
      [workerId]
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

  async insertWorker(workerId, wardNumber, plainPassword) {
    const hashedPassword = await this.hashPassword(plainPassword);
    await db.query(
      `INSERT INTO ${this.table} (WorkerID, WardNumber, Password) VALUES (?, ?, ?)`,
      [workerId, wardNumber, hashedPassword]
    );
  }
}

export default WorkerModel;