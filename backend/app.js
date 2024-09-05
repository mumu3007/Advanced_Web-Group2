const dotenv = require("dotenv");
const cors = require("cors")
const fs = require('fs');
const expressFunction = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const morgan = require("morgan");

dotenv.config()
const { ATLAS_URL } = process.env;

const client = new MongoClient(ATLAS_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Create an Express app
const app = expressFunction();

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    app.use(morgan("dev"))
    app.use(cors())
    app.use(expressFunction.json());
    console.log("Connected to MongoDB!");
    
    
    fs.readdirSync('./routes')
    .filter((file) => file.endsWith('.js')) 
    .map((r) => {
      console.log(`Loading route file: ${r}`);
      return app.use('/', require('./routes/' + r)(client));
    });
  
  

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}


// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
  connectToMongoDB();
});








// getallmanu
// getAllMenu.get('/manu', async (req, res) => {
//   try {
//     const database = client.db('cafeboardgame');
//     const collection = database.collection('Menu');
    
//     // Fetch all documents from the students collection
//     const Manu = await collection.find({}).toArray();
    
//     // Send the retrieved documents as a response
//     res.status(200).json(Manu);
//   } catch (error) {
//     console.error("Error fetching Manu:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// getAllBoardgame.get('/boardgame', async (req, res) => {
//   try {
//     const database = client.db('cafeboardgame');
//     const collection = database.collection('boardgame');
    
//     // Fetch all documents from the students collection
//     const item = await collection.find({}).toArray();
    
//     // Send the retrieved documents as a response
//     res.status(200).json(item);
//   } catch (error) {
//     console.error("Error fetching Boardgame:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
