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
    
    const dbNames = ["ashishforpublic", "test", "ashish", "admin", "local"];
    for (const name of dbNames) {
      console.log(`--- Checking database: ${name} ---`);
      const db = client.db(name);
      try {
        const collections = await db.listCollections().toArray();
        console.log(`Collections in ${name}:`, collections.map(c => c.name));
        for (const collInfo of collections) {
          const coll = db.collection(collInfo.name);
          const count = await coll.countDocuments();
          console.log(`  Collection ${collInfo.name} has ${count} documents`);
          if (count > 0) {
            const docs = await coll.find({}).limit(5).toArray();
            console.log(`  Sample docs in ${collInfo.name}:`, JSON.stringify(docs, null, 2));
          }
        }
      } catch (err) {
        console.error(`Failed to list collections for ${name}:`, err.message);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
main();
