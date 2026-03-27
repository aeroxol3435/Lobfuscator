import { Router, type IRouter } from "express";

const router: IRouter = Router();

let mongoClient: import("mongodb").MongoClient | null = null;
let mongoDb: import("mongodb").Db | null = null;

async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (mongoDb) return mongoDb;
  try {
    const { MongoClient } = await import("mongodb");
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    mongoDb = mongoClient.db("lobfuscator");
    return mongoDb;
  } catch (e) {
    return null;
  }
}

router.post("/store", async (req, res) => {
  const { title, content } = req.body ?? {};
  if (!title || !content) {
    res.status(400).json({ error: "Missing title or content" });
    return;
  }
  const db = await getDb();
  if (!db) {
    res.status(503).json({ error: "MongoDB not configured" });
    return;
  }
  try {
    const col = db.collection("obfuscations");
    await col.insertOne({
      title: String(title).slice(0, 100),
      content: String(content),
      createdAt: new Date(),
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
