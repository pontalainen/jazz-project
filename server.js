import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Open SQLite database
async function openDb() {
    return open({
        filename: './db/db.sqlite',
        driver: sqlite3.Database
    });
}

const validateFields = (req, res, next) => {
    const { firstname, lastname, email } = req.body;
    if (!firstname || !lastname || !email) {
        res.status(400).json({ error: 'Alla fält måste fyllas i' });
        return;
    }
    next();
};

// Example API endpoint
app.post('/save', validateFields, async (req, res) => {
    const db = await openDb();

    const { firstname, lastname, email } = req.body;

    await db.run(
        'INSERT INTO members (firstname, lastname, email) VALUES (?, ?, ?)',
        [firstname, lastname, email]
    );

    res.status(200).json({ message: 'Medlem tillagd' });
});

app.post('/update/:id', validateFields, async (req, res) => {
    const db = await openDb();

    const id = req.params.id;
    const { firstname, lastname, email } = req.body;

    await db.run(
        'UPDATE members SET firstname = ?, lastname = ?, email = ? WHERE id = ?',
        [firstname, lastname, email, id]
    );

    res.status(200).json({ message: 'Medlem uppdaterad' });
});

app.get('/members', async (req, res) => {
    const db = await openDb();
    const members = await db.all('SELECT * FROM members');
    res.status(200).json(members);
});

app.get('/members/:id', async (req, res) => {
    const db = await openDb();
    const member = await db.get('SELECT * FROM members WHERE id = ?', [req.params.id]);
    res.status(200).json(member);
});

app.delete('/members/:id', async (req, res) => {
    const db = await openDb();
    await db.run('DELETE FROM members WHERE id = ?', [req.params.id]);
    res.status(200).json({ message: 'Medlem raderad' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});