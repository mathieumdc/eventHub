const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connexion à MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Par défaut sur XAMPP
    password: '',      // Vide par défaut
    database: 'eventhub'
});

// Vérifier la connexion
db.connect(err => {
    if (err) throw err;
    console.log('✅ Connected to MySQL database.');
});

// ----------- EVENTS -----------

app.get('/events', (req, res) => {
    db.query('SELECT * FROM events', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/events/:id', (req, res) => {
    db.query('SELECT * FROM events WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Event not found' });

        const event = results[0];

        console.log("🔍 Event fetched from DB:", event);

        res.json({
            id: event.id,
            title: event.title,
            address: event.address,
            date: event.date,
            category: event.category,
            description: event.Description || ''
        });
    });
});

app.post('/events', (req, res) => {
    const { title, address, date, category, description } = req.body;
    db.query(
        'INSERT INTO events (title, address, date, category, description) VALUES (?, ?, ?, ?, ?)', 
        [title, address, date, category, description],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Event created', id: result.insertId });
        }
    );
});

app.put('/events/:id', (req, res) => {
    const { title, address, date, category, description } = req.body;
    db.query(
        'UPDATE events SET title = ?, address = ?, date = ?, category = ?, description = ? WHERE id = ?',
        [title, address, date, category, description, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Event updated' });
        }
    );
});

// ----------- USERS -----------

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/users', (req, res) => {
    const { name, email, password, birthdate, locality } = req.body;
    db.query('INSERT INTO users (name, email, password, birthdate, locality) VALUES (?, ?, ?, ?, ?)',
        [name, email, password, birthdate, locality],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email already registered' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User created', id: result.insertId });
        }
    );
});

// ----------- LOGIN -----------

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', 
        [email, password], 
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
            res.json({ message: 'Login successful', user: results[0] });
        }
    );
});

// ----------- SERVER -----------

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
