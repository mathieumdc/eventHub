const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

const EVENTS_FILE = './events.json';
const USERS_FILE = './users.json';

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// ----------------- EVENTS -----------------

function readEvents() {
    if (!fs.existsSync(EVENTS_FILE)) return [];
    const data = fs.readFileSync(EVENTS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
}

function writeEvents(events) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 4));
}

app.get('/events', (req, res) => {
    const events = readEvents();
    res.json(events);
});

app.post('/events', (req, res) => {
    const events = readEvents();
    const newEvent = req.body;
    newEvent.id = Date.now();
    events.push(newEvent);
    writeEvents(events);
    res.status(201).json({ message: 'Event created', event: newEvent });
});

app.put('/events/:id', (req, res) => {
    const events = readEvents();
    const id = parseInt(req.params.id);
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ error: 'Event not found' });

    events[index] = { ...events[index], ...req.body };
    writeEvents(events);
    res.json({ message: 'Event updated', event: events[index] });
});

app.get('/events/:id', (req, res) => {
    const events = readEvents();
    const id = parseInt(req.params.id);
    const event = events.find(e => e.id === id);

    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json(event);
});

// ----------------- USERS -----------------

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 4));
}

app.get('/users', (req, res) => {
    const users = readUsers();
    res.json(users);
});

app.post('/users', (req, res) => {
    const users = readUsers();
    const { name, email, password, birthdate, locality } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        birthdate,
        locality
    };

    users.push(newUser);
    writeUsers(users);
    res.status(201).json({ message: 'User created', user: newUser });
});

// ----------------- LOGIN -----------------

app.post('/login', (req, res) => {
    console.log("Tentative de login avec:", req.body); // <-- Ajoute cette ligne
    const users = readUsers();
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        console.log("Échec - Email ou mot de passe incorrect");
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log("Succès - User trouvé:", user); // <-- Ajoute cette ligne
    res.json({ message: 'Login successful', user });
});

// ----------------- SERVER -----------------

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
