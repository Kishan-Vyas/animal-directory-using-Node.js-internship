const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3000;

const url = process.env.MONGODB_URL;

const dbName = 'animalDirectory';
const collectionName = 'animals';

app.use(express.json());

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Get all animals
    app.get('/animals', async (req, res) => {
        const animals = await collection.find({}).toArray();
        res.json(animals);
    });

    // Add a new animal
    app.post('/animals', async (req, res) => {
        const newAnimal = req.body;
        const result = await collection.insertOne(newAnimal);
        res.json(result.ops[0]);
    });

    // Update an existing animal
    app.put('/animals/:id', async (req, res) => {
        const id = req.params.id;
        const updatedAnimal = req.body;
        const result = await collection.updateOne({ _id: ObjectId(id) }, { $set: updatedAnimal });
        res.json({ message: `Animal with id ${id} updated` });
    });

    // Delete an animal
    app.delete('/animals/:id', async (req, res) => {
        const id = req.params.id;
        await collection.deleteOne({ _id: ObjectId(id) });
        res.json({ message: `Animal with id ${id} deleted` });
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
