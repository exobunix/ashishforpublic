import { MongoClient, Db } from "mongodb";
import { logger } from "./logger";

const uri = process.env.MONGODB_URI || "mongodb+srv://adarshdeepsachan_db_user:8wh3xfMYcHlopUI2@ashish.5g2ixrm.mongodb.net/?appName=ashish";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (client && db) {
    return { client, db };
  }

  try {
    logger.info("Connecting to MongoDB...");
    client = new MongoClient(uri);
    await client.connect();
    
    // We can extract database name or default to 'ashishforpublic'
    db = client.db("ashishforpublic");
    logger.info("Connected to MongoDB successfully");
    return { client, db };
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to MongoDB");
    throw error;
  }
}
