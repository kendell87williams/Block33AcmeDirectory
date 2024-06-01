const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )`);

  db.run(`CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    department_id INTEGER,
    FOREIGN KEY(department_id) REFERENCES departments(id)
  )`);

  db.run("INSERT INTO departments (name) VALUES ('HR'), ('Engineering')");
  db.run("INSERT INTO employees (name, department_id) VALUES ('John Doe', 1), ('Jane Smith', 2)");
});

module.exports = db;
