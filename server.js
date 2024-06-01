const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

app.get('/api/employees', (req, res) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/departments', (req, res) => {
  db.all("SELECT * FROM departments", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/employees', (req, res) => {
  const { name, department_id } = req.body;
  const stmt = db.prepare("INSERT INTO employees (name, department_id) VALUES (?, ?)");
  stmt.run(name, department_id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, department_id });
  });
  stmt.finalize();
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM employees WHERE id = ?", id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
});

app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, department_id } = req.body;
  const stmt = db.prepare("UPDATE employees SET name = ?, department_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
  stmt.run(name, department_id, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, name, department_id });
  });
  stmt.finalize();
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
