const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const server = express();
const STATUS_USER_ERROR = 422;
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};
const words = readWords();
const finalWord = words[Math.floor(Math.random() * words.length)];
let guesses = {};

server.use(bodyParser.json());

// POST /guess
server.post('/guess', (req, res) => {
  
  const letter = req.body.letter;
  // if no letter was provided
  if (!letter) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a letter' });
    return;
  }
  // if letter is longer than 1 char
  if (letter.length !== 1) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a SINGLE letter' });
    return;
  }
  // letter provided but already guessed
    if (guesses[letter]) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Cannot guess letter twice' });
    return;
  }
  guesses[letter] = true;
  res.send({ guesses });
});

// GET /
server.get('/', (req, res) => {
  const wordSoFarArray = Array.from(finalWord).map((letter) => {
    if (guesses[letter]) return letter;
    return '-';
  });
  const wordSoFar = wordsSoFarArray.join('');
  res.status(200).send(wordSoFar, guesses);
});

server.listen(3000);
