const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note
notes.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Filter json data for a note that has the same note id as the one sent in the request params
      const result = json.filter((note) => note.id === noteId);
      // If note is greater than 0 in length, return the note, otherwise return an error message
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// DELETE Route for a specific note
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Filter json data to create new array with all notes excluding the note with the ID sent in the request params
      const result = json.filter((note) => note.id !== noteId);

      // Save filtered array to the json database db.json
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

// POST Route for a new note
notes.post('/', (req, res) => {
  console.log(req.body);

  // Create variables containing new note's title and content
  const { title, text } = req.body;

  // Create new note object containing title, content and a randomly-generated note ID
  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    // Add new note to the json db
    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;