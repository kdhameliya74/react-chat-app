import sqlite3 from 'sqlite3';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import path from 'path'
import { fileURLToPath } from 'url';
const SECRET = `v/94:V"Sj?0|1$RZDu`; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../database/users.db');

const db = new sqlite3.Database(dbPath);
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_online BOOLEAN DEFAULT 0
  )
`);

export const registerUser = async (firstname, lastname, email, password) => {
  const hashedPasswd = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO users (firstname,lastname, email, password) VALUES (?, ?, ?, ?)", [firstname,lastname, email, hashedPasswd], function (err) {
      if (err) return reject(err);
      const token = jwt.sign({ id: this.lastID, email: email }, SECRET, { expiresIn: "1h" });
      db.run('UPDATE users SET is_online = 1 WHERE id = ?', [this.lastID]);
      resolve({ token, user: { id: this.lastID, firstname, lastname, email } });
    });
  });
}

export const loginUser = async (email, password) => {
 return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return reject(err);
        if (!user) return reject(new Error("User not found"));
        const match = await bcrypt.compare(password, user.password);
        if (!match) return reject(new Error("Invalid password"));
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
        db.run('UPDATE users SET is_online = 1 WHERE id = ?', [user.id]);
      resolve({ token, user: { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname } });
      })
 });
}

export const logoutUser = async (id) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET is_online = 0 WHERE id = ?', [id], async (err, user) => {
      if (!user) return reject(new Error('User not found'));
      if (err) return reject(new Error(err));
      resolve('logout successfully!');
    })
  })
}

export const getOnlineUsers = async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, firstname, lastname, email, is_online FROM users WHERE is_online = 1', [], async (err, users) => {
      if (err) return reject(new Error(err));
      resolve(users);
    })
  })
}