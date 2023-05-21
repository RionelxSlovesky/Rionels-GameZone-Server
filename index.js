const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// mognodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.spr5boq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("SHUNCHI BONDUUUUU");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const toysCollection = client.db("gameZoneDatabase").collection("toys");

    app.get("/toys", async (req, res) => {
      try {
        if (req.query.sellerEmail) {
          query = {
            sellerEmail: req.query.sellerEmail,
          };
        }
        const cursor = toysCollection.find(query).limit(20);
        query = {};
        result = await cursor.toArray();
        res.send(result);
      } catch (err) {
        console.log(err.message);
      }
    });

    app.get("/toys/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const query = { _id: new ObjectId(id) };

        const result = await toysCollection.findOne(query);

        res.send(result);
      } catch (err) {
        console.log(err.message);
      }
    });

    app.post("/toys", async (req, res) => {
      try {
        const toy = req.body;
        const result = await toysCollection.insertOne(toy);
        res.send(result);
      } catch (err) {
        console.log(err.message);
      }
    });

    app.delete("/toys/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await toysCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        console.log(err.message);
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Listening to PORT ${port}`);
});
