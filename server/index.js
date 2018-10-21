const express = require("express");
const BodyParser = require("body-parser");
const app = express();
app.use(BodyParser.urlencoded({extended: false}));
app.use(BodyParser.json());

// Set up Redis Client
const redisClient = require('redis').createClient(process.env.REDIS_URL);
redisClient.on('connect', () => console.log('Redis client connected'));
redisClient.on('error', err => console.log('Redis client error: ' + err));
redisClient.flushall(function (err, res) {
    const gameState = [
        {col: 0, row: 0, piece: {type: 'K', color: 'white'}},
        {col: 1, row: 0, piece: {type: 'Q', color: 'white'}},
        {col: 2, row: 0, piece: {type: 'R', color: 'white'}},
        {col: 3, row: 0, piece: {type: 'H', color: 'white'}},
        {col: 4, row: 0, piece: {type: 'B', color: 'white'}},
        {col: 5, row: 0, piece: null},
        {col: 6, row: 0, piece: null},
        {col: 7, row: 0, piece: null},
        {col: 0, row: 1, piece: null},
        {col: 1, row: 1, piece: null},
        {col: 2, row: 1, piece: null},
        {col: 3, row: 1, piece: null},
        {col: 4, row: 1, piece: null},
        {col: 5, row: 1, piece: null},
        {col: 6, row: 1, piece: {type: 'P', color: 'white'}},
        {col: 7, row: 1, piece: {type: 'P', color: 'white'}},
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
        {col: 6, row: 6, piece: {type: 'P', color: 'black'}},
        {col: 7, row: 6, piece: {type: 'P', color: 'black'}},
        {col: 0, row: 7, piece: {type: 'K', color: 'black'}},
        {col: 1, row: 7, piece: {type: 'Q', color: 'black'}},
        {col: 2, row: 7, piece: {type: 'R', color: 'black'}},
        {col: 3, row: 7, piece: {type: 'H', color: 'black'}},
        {col: 4, row: 7, piece: {type: 'B', color: 'black'}},
        {col: 5, row: 7, piece: null},
        {col: 6, row: 7, piece: null},
        {col: 7, row: 7, piece: null},
    ];
    redisClient.rpush("gameState", gameState.map(obj => JSON.stringify(obj)));
});


app.get('/', (req, res) => {
    res.send('API working');
});

// Get game state of chessboard
app.get('/getGameState', (req, res) => {
    redisClient.lrange('gameState', 0, -1, function (err, reply) {
        res.json(reply.map(obj => JSON.parse(obj)));
    });
});

// Make a move and update chessboard
app.post('/makeMove', (req, res) => {
    redisClient.lindex('gameState', req.body.startCell, function (err, reply) {
        let firstCell = JSON.parse(reply);
        redisClient.lindex('gameState', req.body.endCell, function (err, reply) {
            let secondCell = JSON.parse(reply);
            if (firstCell.piece !== null) {
                let validMove = false;
                // Initialize validity as false. If the condition is met, change it to true.
                let fRow = firstCell.row;
                let fCol = firstCell.col;
                let sRow = secondCell.row;
                let sCol = secondCell.col;
                let curRow = fRow;
                let curCol = fCol;
                switch (firstCell.piece.type) {
                    case "K":
                        if (fRow - sRow === 1 || sRow - fRow === 1) {
                            if (fCol - sCol === 1 || sCol - fCol === 1) {
                                validMove = true;
                            }
                        }
                        validMove = true;
                        break;
                    // case "P": //Pawn.
                    //   if(firstCell.piece.color === "white"){
                    //     if (secondCell.piece === null) {
                    //       if (fCol === sCol && fRow + 1 === sRow) {
                    //         validMove = true;
                    //     } else if (secondCell.piece.color === "black") {
                    //         if ((sCol === fCol + 1 || sCol === fCol - 1) && fRow + 1 === sRow) {
                    //           validMove = true;
                    //         }
                    //       }
                    //     }
                    //   } else if (firstCell.piece.color === "black") {
                    //     if (secondCell.piece === null) {
                    //       if (fCol === sCol && fRow === sRow + 1) {
                    //         validMove = true;
                    //       }
                    //     } else if (secondCell.piece.color === "white") {
                    //       if ((fCol === sCol - 1 || fCol === sCol + 1) && fRow === sRow + 1) {
                    //         validMove = true;
                    //       }
                    //     }
                    //   }
                    //   break;
                    case "H": //Horse.
                        if (fRow - sRow === 2 || sRow - fRow === 2) {
                            if (fCol - sCol === 1 || sCol - fCol === 1) {
                                validMove = true;
                            }
                        } else if (fRow - sRow === 1 || sRow - fRow === 1) {
                            if (fCol - sCol === 2 || sCol - fCol === 2) {
                                validMove = true
                            }
                        }
                        break;
                    case "B": //Bishop.
                        while (curRow <= 7 && curCol <= 7) {
                            if (curRow === sRow && curCol === sCol) {
                                validMove = true;
                            }
                            curRow += 1;
                            curCol += 1;
                        }
                        curRow = fRow;
                        curCol = fCol;
                        while (curRow >= 0 && curCol >= 0) {
                            if (curRow === sRow && curCol === sCol) {
                                validMove = true;
                            }
                            curRow -= 1;
                            curCol -= 1;
                        }
                        curRow = fRow;
                        curCol = fCol;
                        while (curRow <= 7 && curCol >= 0) {
                            if (curRow === sRow && curCol === sCol) {
                                validMove = true;
                            }
                            curRow += 1;
                            curCol -= 1;
                        }
                        curRow = fRow;
                        curCol = fCol;
                        while (curRow >= 0 && curCol <= 7) {
                            if (curRow === sRow && curCol === sCol) {
                                validMove = true;
                            }
                            curRow -= 1;
                            curCol += 1;
                        }
                        break;
                    case "R": //Rook.
                        while (curRow <= 7) {
                            if (curRow === sRow && curCol === sCol) {
                                validMove = true;
                            }
                            curRow += 1;
                        }
                        curRow = fRow;
                        curCol = fCol;
                        while (curRow >= 0) {
                            if (curRow === sRow && curCol === sCol) {
                                validMove = true;
                            }
                            curRow -= 1;
                        }
                        curRow = fRow;
                        curCol = fCol;
                        while (curCol >= 0) {
                            if (curRow === sRow && curCol === sCol) {
                                validMove = true;
                            }
                            curCol -= 1;
                        }
                        curRow = fRow;
                        curCol = fCol;
                        while (curCol <= 7) {
                            if (curRow === sRow && curCol === sCol) {
                                validMove = true;
                            }
                            curCol += 1;
                        }
                        break;
                    default:
                        console.log('Error Piece Detected');
                }
                if (validMove && secondCell.piece === null) {
                    redisClient.lset('gameState', req.body.startCell, JSON.stringify({...firstCell, piece: null}));
                    redisClient.lset('gameState', req.body.endCell, JSON.stringify({
                        ...secondCell,
                        piece: firstCell.piece
                    }));
                } else if (validMove && (secondCell.piece !== null)) {
                    if (firstCell.piece.color !== secondCell.piece.color) {
                        redisClient.lset('gameState', req.body.startCell, JSON.stringify({...firstCell, piece: null}));
                        redisClient.lset('gameState', req.body.endCell, JSON.stringify({
                            ...secondCell,
                            piece: firstCell.piece
                        }));
                    }
                }
            }
            redisClient.lrange('gameState', 0, -1, function (err, reply) {
                res.json(reply.map(obj => JSON.parse(obj)));
            });
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}`);
});