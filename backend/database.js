const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./petstore.db');

module.exports = db;

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS toys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('dog', 'cat')),
    description TEXT,
    image_url TEXT,
    price REAL,
    stock INTEGER DEFAULT 10
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS food (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    animal TEXT CHECK(animal IN ('dog', 'cat')),
    brand TEXT,
    description TEXT,
    image_url TEXT,
    price REAL,
    stock INTEGER DEFAULT 10
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS grooming_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price REAL
  )`);
});
