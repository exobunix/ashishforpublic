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

  // Parse and redact MONGODB_URI to see host & db info safely
  let uriInfo = {};
  if (process.env.MONGODB_URI) {
    try {
      const parts = process.env.MONGODB_URI.split("@");
      const hostPart = parts[parts.length - 1];
      const credentialPart = parts[0].replace("mongodb+srv://", "").replace("mongodb://", "");
      const username = credentialPart.split(":")[0];
      
      const hostAndDb = hostPart.split("/");
      const host = hostAndDb[0];
      const dbNameWithQuery = hostAndDb[1] || "";
      const dbName = dbNameWithQuery.split("?")[0];
      
      uriInfo = {
        username,
        host,
        dbName,
      };
    } catch (e: any) {
      uriInfo = { error: "Failed to parse URI: " + e.message };
    }
  } else {
    uriInfo = { status: "not set, using fallback" };
  }

  res.json({
    status: "ok",
    dbStatus,
    dbError,
    uriInfo,
    mongodb_uri_set: !!process.env.MONGODB_URI,
  });
});

export default router;
