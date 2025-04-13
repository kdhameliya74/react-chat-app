import sqlite3 from 'sqlite3';
import path from 'path'
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = path.join(__dirname, '../database/chat.db');

const db = new sqlite3.Database(dbPath);

db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      receiver TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

export const setChatMessage = async (sender, receiver, message) => {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)", [sender, receiver, message], function (err, message) {
      if (err) return reject(err);
      db.get('SELECT * FROM messages WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {return reject(err) }
        resolve(row);
      });
      
    });
  });
}

export const getAllMessages = async (user1, user2 ) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM messages 
       WHERE (sender = ? AND receiver = ?) 
          OR (sender = ? AND receiver = ?)
       ORDER BY timestamp ASC`,
      [user1, user2, user2, user1],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows)
      }
    );
  })
}