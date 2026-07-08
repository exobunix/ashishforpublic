import { Router } from "express";
import { connectToDatabase } from "../lib/mongodb";
import multer from "multer";

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

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

router.post("/upload", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "private_q34ikaQJf2j1Frf6WPMDoDJ+5cU=";

    // Convert to base64 for ImageKit upload API
    const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");

    const formData = new FormData();
    const fileBlob = new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype });
    formData.append("file", fileBlob, req.file.originalname);
    formData.append("fileName", req.file.originalname);

    const ikResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    if (!ikResponse.ok) {
      const errorText = await ikResponse.text();
      res.status(500).json({ error: "Failed to upload to ImageKit", details: errorText });
      return;
    }

    const result = (await ikResponse.json()) as { url: string };
    res.json({ url: result.url });
    return;
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: String(error) });
    return;
  }
});

export default router;
