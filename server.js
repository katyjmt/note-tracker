const express = require('express');
const path = require('path');
const notes = require('./db/db.json');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON & urlencoded data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Middleware for serving static files from public folder
app.use(express.static('public'));

// Send all the requests that begin with /api to the index.js in the routes folder
app.use('/api', api);

// GET Route for notes page 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for homepage
app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
});