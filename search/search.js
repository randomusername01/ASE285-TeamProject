const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors());

const uri = 'mongodb+srv://jacksonp11:pL40j8U3JQV3PD0T@cluster0.dncl3rb.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri);
let collection;

async function startServer() {
    try {
      await client.connect();
      const db = client.db('test');
      collection = db.collection('InventoryStorage');
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error(err);
    }
  }

  app.get('/search', async (req, res) => {
    const query = req.query.q;
    console.log("Received query:", query);
  
    try {
      const results = await collection.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      }).toArray();
  
      console.log("Search results:", results);
      res.json(results);
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).send("Error searching database");
    }
  });
  
  

startServer();
