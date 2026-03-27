import { Router, type IRouter } from "express";
import { db, obfuscationsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/store", async (req, res) => {
  const { title, content } = req.body ?? {};
  if (!title || !content) {
    res.status(400).json({ error: "Missing title or content" });
    return;
  }
  try {
    await db.insert(obfuscationsTable).values({
      title: String(title).slice(0, 100),
      content: String(content),
    });
    res.json({ success: true });
  } catch (e) {
    req.log.error({ err: e }, "Failed to store obfuscation");
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
