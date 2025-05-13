import express from 'express';
import cors from 'cors';
import contacts from "./contacts.json" assert { type: "json" };

const app = express();
const PORT = process.env.PORT ?? 6789;

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static('../public'));

// Load contacts from JSON
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});