import db from './db.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS districts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS menu_contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_name TEXT UNIQUE NOT NULL,
    english_content TEXT,
    tamil_content TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    district_id INTEGER,
    email_verified INTEGER DEFAULT 0,
    verification_code TEXT,
    FOREIGN KEY(district_id) REFERENCES districts(id)
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

console.log('DB initialized');
