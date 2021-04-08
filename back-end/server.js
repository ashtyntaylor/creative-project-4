const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/movieLibrary', {
  useNewUrlParser: true
});

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  path: String,
  lastRecommended: String,
  genre: String,
});

const Movie = mongoose.model('Movie', movieSchema);

app.get('/api/movies', async (req, res) => {
  try {
    let movies = await Movie.find();
    res.send(movies);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Delete a Movie
app.delete('/api/movies/:id', async (req, res) => {
  try {
    await Movie.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Edit an Item
app.put('/api/movies/:id', async (req, res) => {

  try {
    let movie = await Movie.findOne({
      _id: req.params.id
    });
    movie.title = req.body.title;
    movie.description = req.body.description;
    await movie.save();
    res.send(movie);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/posterImages', upload.single('posterImage'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

app.post('/api/movies', async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    description: req.body.description,
    path: req.body.path,
    lastRecommended: null,
    genre: req.body.genre,
  });
  try {
    await movie.save();
    res.send(movie);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
