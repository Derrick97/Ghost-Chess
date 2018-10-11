const express = require("express");
const app = express();

// Set up Redis Client
const redisClient = require('redis').createClient(process.env.REDIS_URL);
redisClient.on('connect', () => console.log('Redis client connected'));
redisClient.on('error', err => console.log('Redis client error: ' + err));
redisClient.set('gameState', 'gameStateObject');

app.get('/getGameState', (req, res) => {
  redisClient.get('gameState', function (error, result) {
    res.send(result);
  })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}`);
});