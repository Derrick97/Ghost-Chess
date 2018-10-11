const express = require("express");
const BodyParser = require("body-parser");
const app = express();
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())

// Set up Redis Client
const redisClient = require('redis').createClient(process.env.REDIS_URL);
redisClient.on('connect', () => console.log('Redis client connected'));
redisClient.on('error', err => console.log('Redis client error: ' + err));
redisClient.set('gameState', 'gameStateObject'); // TODO: replace 'gameStateObject' with game state object

app.get('/', (req, res) => {
  res.send('API working');
});

// Get game state of chessboard
app.get('/getGameState', (req, res) => {
  redisClient.get('gameState', function (error, result) {
    if (error) throw error;
    res.send(result);
  })
});

// Make a move and update chessboard
app.post('/makeMove', (req, res) => {
  redisClient.set('gameState', 'newGameStateObject');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}`);
});