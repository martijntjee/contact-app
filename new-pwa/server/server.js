import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT ?? 6789;

// Connect to MongoDB
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("http://127.0.0.1:6789/api/contacts", async (req, res) => {
  const collection = client.db("pwa_demo").collection("contacts");
  const contacts = await collection.find({}).toArray();
  res.json(contacts);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
