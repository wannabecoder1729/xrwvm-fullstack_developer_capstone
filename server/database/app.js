require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;
const dataDir = path.join(__dirname, 'data');
const reviewsFile = path.join(dataDir, 'reviews.json');
const dealersFile = path.join(dataDir, 'dealerships.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function reviews() {
  return readJson(reviewsFile).reviews;
}

function dealers() {
  return readJson(dealersFile).dealerships;
}

app.get('/', (req, res) => {
  res.send('Welcome to the Dealership API (JSON mode)');
});

app.get('/fetchReviews', (req, res) => {
  res.json(reviews());
});

app.get('/fetchReviews/dealer/:id', (req, res) => {
  const result = reviews().filter(
    r => String(r.dealership) === String(req.params.id)
  );
  res.json(result);
});

app.get('/fetchDealers', (req, res) => {
  res.json(dealers());
});

app.get('/fetchDealers/:state', (req, res) => {
  const result = dealers().filter(
    d => String(d.state).toLowerCase() === req.params.state.toLowerCase()
  );
  res.json(result);
});

app.get('/fetchDealer/:id', (req, res) => {
  const result = dealers().filter(
    d => String(d.id) === String(req.params.id)
  );
  res.json(result);
});

app.post('/insert_review', (req, res) => {
  const data = req.body;

  if (!data || !data.name || !data.dealership || !data.review) {
    return res.status(400).json({
      error: 'Review name, dealership, and review are required'
    });
  }

  try {
    const existing = reviews();
    const nextId = existing.reduce(
      (max, r) => Math.max(max, Number(r.id) || 0), 0
    ) + 1;

    const newReview = {
      id: nextId,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      sentiment: data.sentiment || 'neutral',
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year
    };

    const fileData = readJson(reviewsFile);
    fileData.reviews.push(newReview);
    writeJson(reviewsFile, fileData);

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Review save failed:', error.message);
    res.status(500).json({ error: 'Error saving review' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port} (JSON mode)`);
});
