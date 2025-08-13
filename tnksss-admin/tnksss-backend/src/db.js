import Database from 'better-sqlite3';
export const db = new Database('./tnksss.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS slider_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titleEn TEXT NOT NULL,
    titleTa TEXT,
    date TEXT NOT NULL,
    images TEXT,
    descEn TEXT,
    descTa TEXT,
    publish INTEGER DEFAULT 0
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS about_us (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titleEn TEXT NOT NULL,
    titleTa TEXT,
    descEn TEXT,
    descTa TEXT,
    publish INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titleEn TEXT NOT NULL,
    titleTa TEXT,
    date TEXT NOT NULL,
    images TEXT, -- JSON array of uploaded images
    descEn TEXT,
    descTa TEXT,
    publish INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    messageEn TEXT,
    messageTa TEXT,
    publish INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

