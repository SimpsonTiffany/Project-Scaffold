const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('./database/university.db', (err) => {


    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// GET all courses
app.get('/api/courses', (req, res) => {
    const sql = "SELECT * FROM courses";

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(rows);
    });
});

// GET one course by ID
app.get('/api/courses/:id', (req, res) => {
    const sql = "SELECT * FROM courses WHERE id = ?";
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Course not found" });

        res.json(row);
    });
});

// INSERT a new course
app.post('/api/courses', (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;

    const sql = `
        INSERT INTO courses (courseCode, title, credits, description, semester)
        VALUES (?, ?, ?, ?, ?)
    `;
    const params = [courseCode, title, credits, description, semester];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ id: this.lastID, message: "Course added successfully!" });
    });
});

// UPDATE a course
app.put('/api/courses/:id', (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;

    const sql = `
        UPDATE courses
        SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
        WHERE id = ?
    `;

    const params = [
        courseCode,
        title,
        credits,
        description,
        semester,
        req.params.id
    ];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Course not found" });

        res.json({ message: "Course updated successfully!" });
    });
});

// DELETE a course
app.delete('/api/courses/:id', (req, res) => {
    const sql = "DELETE FROM courses WHERE id = ?";
    const params = [req.params.id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Course not found" });

        res.json({ message: "Course deleted successfully!" });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
