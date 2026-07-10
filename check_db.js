const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Failed to set DNS servers", e);
}

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://adarshdeepsachan_db_user:8wh3xfMYcHlopUI2@ashish.5g2ixrm.mongodb.net/?appName=ashish";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("ashishforpublic");
    const collection = db.collection("content");
    const docs = await collection.find({}).toArray();
    console.log("Documents:", JSON.stringify(docs, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
main();
