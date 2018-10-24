const express = require("express");
const BodyParser = require("body-parser");
const app = express();
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

// Set up Redis Client
const redisClient = require('redis').createClient(process.env.REDIS_URL);
redisClient.on('connect', () => console.log('Redis client connected'));
redisClient.on('error', err => console.log('Redis client error: ' + err));
redisClient.flushall(function (err, res) {
  const gameState = [
    { col: 0, row: 0, piece: { type: 'R', color: 'white' } },
    { col: 1, row: 0, piece: { type: 'H', color: 'white' } },
    { col: 2, row: 0, piece: { type: 'B', color: 'white' } },
    { col: 3, row: 0, piece: { type: 'K', color: 'white' } },
    { col: 4, row: 0, piece: { type: 'Q', color: 'white' } },
    { col: 5, row: 0, piece: { type: 'B', color: 'white' } },
    { col: 6, row: 0, piece: { type: 'H', color: 'white' } },
    { col: 7, row: 0, piece: { type: 'R', color: 'white' } },
    { col: 0, row: 1, piece: { type: 'P', color: 'white' } },
    { col: 1, row: 1, piece: null },
    { col: 2, row: 1, piece: { type: 'P', color: 'white' }  },
    { col: 3, row: 1, piece: { type: 'P', color: 'white' }  },
    { col: 4, row: 1, piece: null },
    { col: 5, row: 1, piece: { type: 'P', color: 'white' }  },
    { col: 6, row: 1, piece: null },
    { col: 7, row: 1, piece: null },
    { col: 0, row: 2, piece: null },
    { col: 1, row: 2, piece: null },
    { col: 2, row: 2, piece: null },
    { col: 3, row: 2, piece: null },
    { col: 4, row: 2, piece: null },
    { col: 5, row: 2, piece: null },
    { col: 6, row: 2, piece: null },
    { col: 7, row: 2, piece: null },
    { col: 0, row: 3, piece: null },
    { col: 1, row: 3, piece: null },
    { col: 2, row: 3, piece: null },
    { col: 3, row: 3, piece: null },
    { col: 4, row: 3, piece: null },
    { col: 5, row: 3, piece: null },
    { col: 6, row: 3, piece: null },
    { col: 7, row: 3, piece: null },
    { col: 0, row: 4, piece: null },
    { col: 1, row: 4, piece: null },
    { col: 2, row: 4, piece: null },
    { col: 3, row: 4, piece: null },
    { col: 4, row: 4, piece: null },
    { col: 5, row: 4, piece: null },
    { col: 6, row: 4, piece: null },
    { col: 7, row: 4, piece: null },
    { col: 0, row: 5, piece: null },
    { col: 1, row: 5, piece: null },
    { col: 2, row: 5, piece: null },
    { col: 3, row: 5, piece: null },
    { col: 4, row: 5, piece: null },
    { col: 5, row: 5, piece: null },
    { col: 6, row: 5, piece: null },
    { col: 7, row: 5, piece: null },
    { col: 0, row: 6, piece: { type: 'P', color: 'black' } },
    { col: 1, row: 6, piece: null },
    { col: 2, row: 6, piece: null },
    { col: 3, row: 6, piece: null },
    { col: 4, row: 6, piece: { type: 'P', color: 'black' } },
    { col: 5, row: 6, piece: null },
    { col: 6, row: 6, piece: { type: 'P', color: 'black' } },
    { col: 7, row: 6, piece: null },
    { col: 0, row: 7, piece: { type: 'R', color: 'black' } },
    { col: 1, row: 7, piece: { type: 'H', color: 'black' } },
    { col: 2, row: 7, piece: { type: 'B', color: 'black' } },
    { col: 3, row: 7, piece: { type: 'K', color: 'black' } },
    { col: 4, row: 7, piece: { type: 'Q', color: 'black' } },
    { col: 5, row: 7, piece: { type: 'B', color: 'black' } },
    { col: 6, row: 7, piece: { type: 'H', color: 'black' } },
    { col: 7, row: 7, piece: { type: 'R', color: 'black' } },
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
  console.log('Moving from cell ' + req.body.startCell + ' to ' + req.body.endCell);
  redisClient.lindex('gameState', req.body.startCell, function (err, reply) {
    let firstCell = JSON.parse(reply);
    console.log('First cell: ' + firstCell);
    redisClient.lindex('gameState', req.body.endCell, function (err, reply) {
      let secondCell = JSON.parse(reply);
      console.log('Second cell: ' + secondCell);

      redisClient.lrange('gameState', 0, -1), function (err, reply) {
        console.log("Reply: " + reply);
        console.log(JSON.parse(reply));
        console.log(JSON.parse(reply.map(obj => JSON.parse(obj))));
        res.json([]);
        /*
        // Get current gameState
        console.log('Getting current gamestate ...');
        let gameState = reply.map(obj => JSON.parse(obj));
        console.log('GameState: ' + gameState);

        // Check if move is valid with the current gameState
        let validMove = validateMove(firstCell, secondCell, gameState);

        // Update move if move is valid
        if (validMove) {
          redisClient.lset('gameState', req.body.startCell, JSON.stringify({ ...firstCell, piece: null }));
          redisClient.lset('gameState', req.body.endCell, JSON.stringify({ ...secondCell, piece: firstCell.piece }));
        }

        res.json(gameState);
        */
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
});

function validateMove(firstCell, secondCell, gameState) {
  // Check first cell contains piece
  if (firstCell.piece == null) return false;
  // Check second cell does not contain piece.
  // TODO: modify logic for piece capture
  if (secondCell.piece !== null) return false;
  // Check the two cells are different
  if (firstCell.col === secondCell.col && firstCell.row === secondCell.row) return false;

  // Initailize isValidMove to false
  let isValidMove = false;
  switch (firstCell.piece.type) {
    case 'K': // King
      isValidMove = validateKing(firstCell, secondCell);
      break;
    case 'Q': // Queen
      isValidMove = validateQueen(firstCell, secondCell, gameState);
      break;
    case 'B': // Bishop
      isValidMove = validateBishop(firstCell, secondCell, gameState);
      break;
    case 'H': // Horse
      isValidMove = validateHorse(firstCell, secondCell);
      break;
    case 'R': // Rook
      isValidMove = validateRook(firstCell, secondCell, gameState);
      break;
    case 'P': // Pawn
      isValidMove = validatePawn(firstCell, secondCell);
      break;
    default:
      console.log('Error Piece Detected');
  }
  return isValidMove;
}

// Returns the Cell object with the specified column and row from a given GameState
function getCell(col, row, gameState) {
  return gameState.find(function (cell) {
    return cell.col === col && cell.row === row
  });
}

function validateKing(firstCell, secondCell) {
  console.log('Validating King Move');
  // A move from (C1, R1) to (C2, R2) is valid iff |C1-C2| <= 1 and |R1-R2| <= 1
  return Math.abs(firstCell.col - secondCell.col) <= 1 &&
    Math.abs(firstCell.row - secondCell.row) <= 1
}

function validateQueen(firstCell, secondCell, gameState) {
  console.log('Validating Queen Move');
  // A move is valid if it is a valid move for root or valid move for bishop
  return validateRook(firstCell, secondCell, gameState) || validateBishop(firstCell, secondCell, gameState);
}

function validateBishop(firstCell, secondCell, gameState) {
  console.log('Validating Bishop Move');
  // A move from (C1, R1) to (C2, R2) is valid iff |C1-C2| == |R1-R2|
  if (Math.abs(firstCell.col - secondCell.col) !== Math.abs(firstCell.row - secondCell.row)) return false;

  // Calculate column difference of start and end cell
  let colDiff = firstCell.col - secondCell.col;
  // Claculate row difference of start and end cell
  let rowDiff = firstCell.row - secondCell.row;

  // A move along NW/SE diagonal 
  if (colDiff * rowDiff > 0) {
    let minCol = Math.min(firstCell.col, secondCell.col);
    let maxCol = Math.max(firstCell.col, secondCell.col);
    let minRow = Math.min(firstCell.row, secondCell.row);
    // Check each cell on the diagonal path starting from NW, 
    // excluding start and end cell ...
    for (let col = minCol + 1, row = minRow + 1; col < maxCol; col++, row++) {
      let cell = getCell(col, row, gameState);
      console.log('Bishop: checking cell ' + cell);
      // ... To make sure there are no other pieces on the path
      if (cell.piece) return false;
    }
  } else {
    // Otherwise, a move along NE/SW diagonal
    let minCol = Math.min(firstCell.col, secondCell.col);
    let maxCol = Math.max(firstCell.col, secondCell.col);
    let maxRow = Math.max(firstCell.row, secondCell.row);
    // Check each cell on the diagram path from SW,
    // excluding start and end cell ...
    for (let col = minCol + 1, row = maxRow - 1; col < maxCol; col++ , row--) {
      let cell = getCell(col, row, gameState);
      console.log('Bishop: checking cell ' + cell);
      // ... To make sure there are no other pieces on the path
      if (cell.piece) return false;
    }
  }

  // Pass all checks
  return true;
}

function validateHorse(firstCell, secondCell) {
  console.log('Validating Horse Move');
  // A move from (C1, R1) to (C2, R2) is valid iff
  // |C1-C2| == 1 and |R1-R2| == 2  OR |C1-C2| == 2 and |R1-R2| == 1
  return (Math.abs(firstCell.col - secondCell.col) === 1 && Math.abs(firstCell.row - secondCell.row) === 2) ||
    (Math.abs(firstCell.col - secondCell.col) === 2 && Math.abs(firstCell.row - secondCell.row) === 1);
}

function validateRook(firstCell, secondCell, gameState) {
  console.log('Validating Rook Move');
  // A move from (C1, R1) to (C2, R2) is valid iff C1 == C2 or R1 == R2
  if (!(firstCell.col === secondCell.col || firstCell.row === secondCell.row)) return false;

  // If start and end cells are in the same column ...
  if (firstCell.col === secondCell.col) {
    let col = firstCell.col;
    // ... Check each cell on the path in the same column ...
    let minRow = Math.min(firstCell.row, secondCell.row);
    let maxRow = Math.max(firstCell.row, secondCell.row);
    // ... Excluding start and end cell ...
    for (let row = minRow + 1; row < maxRow; row++) {
      let cell = getCell(col, row, gameState);
      console.log('Rook: checking cell ' + cell);
      // ... To make sure there are no other pieces on the path ...
      if (cell.peice) return false;
    }
  } else {
    // Otherwise, start and end cells are in the same row
    let row = firstCell.row;
    // ... Check each cell on the path in the same row ...
    let minCol = Math.min(firstCell.col, secondCell.col);
    let maxCol = Math.min(firstCell.col, secondCell.col);
    // ... Excluding start and end cell ...
    for (let col = minCol + 1; col < maxCol; col++) {
      let cell = getCell(col, row, gameState);
      console.log('Rook: checking cell ' + cell);
      // ... To make sure there are no other pieces on the path ...
      if (cell.piece) return false;
    }
  }
    // Pass all checks
    return true;
}

function validatePawn(firstCell, secondCell) {
  console.log('Validating Pawn Move');
  //The pawn stay on the same col
  let sameCol = (firstCell.col === secondCell.col);
  //The pawn move 1 step
  let moveOne = Math.abs(firstCell.row - secondCell.row) === 1;
  //The pawn move 2 step
  let moveTwo = Math.abs(firstCell.row - secondCell.row) === 2;
  //The piece is white
  if (firstCell.piece.color === 'white') {
    //On the starting row
    if (firstCell.row === 1) {
      return sameCol && (firstCell.row < secondCell.row) && (moveOne || moveTwo);
    }
    return sameCol && (firstCell.row < secondCell.row) && moveOne;
  } else {
    //The piece is black, on starting row
    if (firstCell.row === 6) {
      return sameCol && (secondCell.row < firstCell.row) && (moveOne || moveTwo);
    }
    return sameCol && (secondCell.row < firstCell.row) && moveOne;
  }
}