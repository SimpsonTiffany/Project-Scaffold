const sqlite3 = require('sqlite3').verbose();

// Create new database file called university.db
const db = new sqlite3.Database('./database/university.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});


// Create the courses table
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseCode TEXT NOT NULL,
      title TEXT NOT NULL,
      credits INTEGER NOT NULL,
      description TEXT,
      semester TEXT
    );
  `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Courses table created successfully.');
        }
    });
});

// Close database
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
