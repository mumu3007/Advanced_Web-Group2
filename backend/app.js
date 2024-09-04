const expressFunction = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://thanawat352:1234@cafeboard.cygfo.mongodb.net/?retryWrites=true&w=majority&appName=cafeboard";

const client = new MongoClient(uri, {
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
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

// Define a GET route to fetch data from the students collection
app.get('/students', async (req, res) => {
  try {
    const database = client.db('cafeboardgame');
    const collection = database.collection('students');
    
    // Fetch all documents from the students collection
    const students = await collection.find({}).toArray();
    
    // Send the retrieved documents as a response
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
  connectToMongoDB();
});
