import { Router } from "express";
import { connectToDatabase } from "../lib/mongodb";

const router = Router();

router.get("/content", async (req, res): Promise<void> => {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection("content").findOne({ key: "site-content" });
    if (!doc) {
      res.json(null);
      return;
    }
    res.json(doc.data);
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch content" });
    return;
  }
});

router.post("/content", async (req, res): Promise<void> => {
  try {
    const { db } = await connectToDatabase();
    const data = req.body;
    await db.collection("content").updateOne(
      { key: "site-content" },
      { $set: { data, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ success: true });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to save content" });
    return;
  }
});

export default router;
