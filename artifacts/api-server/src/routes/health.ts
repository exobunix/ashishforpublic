import { Router, type IRouter } from "express";
import { connectToDatabase } from "../lib/mongodb";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  let dbStatus = "unknown";
  let dbError = "";
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    dbStatus = "connected";
  } catch (err: any) {
    dbStatus = "error";
    dbError = err.message || String(err);
  }
  res.json({
    status: "ok",
    dbStatus,
    dbError,
    envKeys: Object.keys(process.env).filter(k => k.includes("MONGO") || k.includes("URI") || k.includes("DATABASE") || k.includes("PORT")),
    mongodb_uri_set: !!process.env.MONGODB_URI,
  });
});

export default router;
