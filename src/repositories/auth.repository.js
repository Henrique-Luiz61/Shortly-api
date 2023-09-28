import { db } from "../database/db.connection.js";

export function findEmailConflictDB(email) {
  return db.query(`SELECT email FROM users WHERE email = $1;`, [email]);
}

export function createUserDB(name, email, hash) {
  return db.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
    [name, email, hash]
  );
}

export function findUserByEmailDB(email) {
  return db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
}

export function createSessionDB(userId, userName, token) {
  return db.query(
    `INSERT INTO sessions ("userId", "userName", token) 
            VALUES ($1, $2, $3);`,
    [userId, userName, token]
  );
}
