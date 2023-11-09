require('dotenv').config()

// setup for middleware for stores endpoint/route
const express = require('express')
const router = express.Router()
const { MongoClient } = require("mongodb");
const uri = process.env.DATABASE_URL;


// Getting all
router.get('/', getApplications, (req, res) => {
    res.json(res.applications) // getApplication already findById() from req.params.id
})

async function getApplications(req, res, next) {    
    const client = new MongoClient(uri);
    try {
        // Get the database and collection on which to run the operation
        const database = client.db("metrics");
        const dashboard = database.collection("dashboard");
        const applications = []

        // Execute query 
        const cursor = dashboard.find();

        if (cursor === null) {
            return res.status(404).json({message: 'Cannot find application'})
        }

        for await (const app of cursor) {
            applications.push(app)
        }

        res.applications = applications 
        next()
    } finally {
        await client.close();
    }
}

module.exports = router 