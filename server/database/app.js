require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const  cors = require('cors')
const app = express()
const port = 3030;

app.use(cors())
app.use(require('body-parser').urlencoded({ extended: false }));

const reviews_data = JSON.parse(fs.readFileSync("data/reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", 'utf8'));




const Reviews = require('./review');

const Dealerships = require('./dealership');

async function seedIfEmpty() {
  const reviewCount = await Reviews.countDocuments();
  const dealershipCount = await Dealerships.countDocuments();

  if (dealershipCount === 0) {
    await Dealerships.insertMany(dealerships_data['dealerships']);
    console.log('Seeded dealerships');
  }

  if (reviewCount === 0) {
    await Reviews.insertMany(reviews_data['reviews']);
    console.log('Seeded reviews');
  }
}


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({ state: req.params.state });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const documents = await Dealerships.find({ id: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

//Express route to insert review
app.post('/insert_review', express.json(), async (req, res) => {
    const data = req.body;
  
    console.log("Received review name:", data?.name);
  
    if (!data || !data.name) {
      return res.status(400).json({
        error: "Review name is missing from request body"
      });
    }
  const documents = await Reviews.find().sort( { id: -1 } )
  let new_id = documents[0]['id']+1

  const review = new Reviews({
		"id": new_id,
		"name": data['name'],
		"dealership": data['dealership'],
		"review": data['review'],
                "sentiment": data['sentiment'],
		"purchase": data['purchase'],
		"purchase_date": data['purchase_date'],
		"car_make": data['car_make'],
		"car_model": data['car_model'],
		"car_year": data['car_year'],
	});

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
		console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
async function startServer() {
  try {
    await mongoose.connect(
      process.env.MONGO_URL || 'mongodb://mongo_db:27017/',
      { dbName: 'dealershipsDB' }
    );

    console.log('Connected to MongoDB');
    await seedIfEmpty();

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to connect or initialize MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
