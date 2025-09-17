// const { urlencoded } = require('express');
require("dotenv").config();
const { MongoClient } = require("mongodb");

let client;
let db;

async function connectToDb() {
  const uri = process.env.MONGO_URL;
  const mongodburl = uri || "place your url here"; // 👈 fallback

  client = new MongoClient(mongodburl);
  await client.connect();
  db = client.db("Greenish");
  const Users = db.collection("Users");

  console.log("✅ MongoDB is connected with Greenish Farmer");

  return { db, Users };
}

const closedb = async () => {
  console.log("SIGTERM signal received: closing MongoDB client");
  if (client) {
    try {
      await client.close();
      console.log("MongoDB client closed");
      process.exit(0);
    } catch (err) {
      console.error("Error closing MongoDB client", err);
      process.exit(1);
    }
  } else {
    process.exit(0);
  }
  console.log("closed");
};

const DB = () => db;

module.exports = { connectToDb, DB, closedb, client };
