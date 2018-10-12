const express = require("express");
const BodyParser = require("body-parser");
const Redis = require('ioredis');
const app = express();
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())

const redis = new Redis(process.env.REDIS_URL);
const gameState = [
    {col: 0, row: 0, piece: null},
    {col: 1, row: 0, piece: null},
    {col: 2, row: 0, piece: null},
    {col: 3, row: 0, piece: null},
    {col: 4, row: 0, piece: {type: 'P', color: 'white'}},
    {col: 5, row: 0, piece: null},
    {col: 6, row: 0, piece: null},
    {col: 7, row: 0, piece: null},
    {col: 0, row: 1, piece: null},
    {col: 1, row: 1, piece: null},
    {col: 2, row: 1, piece: null},
    {col: 3, row: 1, piece: null},
    {col: 4, row: 1, piece: null},
    {col: 5, row: 1, piece: null},
    {col: 6, row: 1, piece: null},
    {col: 7, row: 1, piece: null},
    {col: 0, row: 2, piece: null},
    {col: 1, row: 2, piece: null},
    {col: 2, row: 2, piece: null},
    {col: 3, row: 2, piece: null},
    {col: 4, row: 2, piece: null},
    {col: 5, row: 2, piece: null},
    {col: 6, row: 2, piece: null},
    {col: 7, row: 2, piece: null},
    {col: 0, row: 3, piece: null},
    {col: 1, row: 3, piece: null},
    {col: 2, row: 3, piece: null},
    {col: 3, row: 3, piece: null},
    {col: 4, row: 3, piece: null},
    {col: 5, row: 3, piece: null},
    {col: 6, row: 3, piece: null},
    {col: 7, row: 3, piece: null},
    {col: 0, row: 4, piece: null},
    {col: 1, row: 4, piece: null},
    {col: 2, row: 4, piece: null},
    {col: 3, row: 4, piece: null},
    {col: 4, row: 4, piece: null},
    {col: 5, row: 4, piece: null},
    {col: 6, row: 4, piece: null},
    {col: 7, row: 4, piece: null},
    {col: 0, row: 5, piece: null},
    {col: 1, row: 5, piece: null},
    {col: 2, row: 5, piece: null},
    {col: 3, row: 5, piece: null},
    {col: 4, row: 5, piece: null},
    {col: 5, row: 5, piece: null},
    {col: 6, row: 5, piece: null},
    {col: 7, row: 5, piece: null},
    {col: 0, row: 6, piece: null},
    {col: 1, row: 6, piece: null},
    {col: 2, row: 6, piece: null},
    {col: 3, row: 6, piece: null},
    {col: 4, row: 6, piece: null},
    {col: 5, row: 6, piece: null},
    {col: 6, row: 6, piece: null},
    {col: 7, row: 6, piece: null},
    {col: 0, row: 7, piece: null},
    {col: 1, row: 7, piece: null},
    {col: 2, row: 7, piece: null},
    {col: 3, row: 7, piece: null},
    {col: 4, row: 7, piece: null},
    {col: 5, row: 7, piece: null},
    {col: 6, row: 7, piece: null},
    {col: 7, row: 7, piece: null},
];

// Set up Redis Client
try {
    const result = redis.rpush('gameState', ...gameState);
    console.log(result);
} catch (e) {
    console.error(e);
}

app.get('/', (req, res) => {
  res.send('API working');
});

// Get game state of chessboard
app.get('/getGameState', async (req, res) => {
    try {
        const gameState = await redis.lrange('gameState',0,-1);
        res.json(gameState);
    } catch (error) {
        console.error(error);
    }
});

// Make a move and update chessboard
app.post('/makeMove', (req, res) => {
  res.send('make move');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}`);
});