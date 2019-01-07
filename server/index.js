const express = require("express");
const http = require('http');
var socketio = require('socket.io');
const fetch = require('node-fetch');
const BodyParser = require("body-parser");
let stockfish = require("stockfish");
let engine = stockfish();
let uciok = false;
let position = "startpos";
let currentPlayer = "white";
let pvp = false;

const app = express();
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
const server = http.Server(app);
const websocket = socketio(server);

//-------------------------StockFish Try--------------------
function translateMoveToUCI(firstCell, secondCell) {
  let f_row = 8 - firstCell.row;
  let f_col = String.fromCharCode("a".charCodeAt(0) + firstCell.col);
  let s_row = 8 - secondCell.row;
  let s_col = String.fromCharCode("a".charCodeAt(0) + secondCell.col);
  return f_col + f_row.toString() + s_col + s_row.toString();
}

function send(str) {
  engine.postMessage(str);
}

//Set up Redis Client
const redisClient = require('redis').createClient(process.env.REDIS_URL);
redisClient.on('connect', () => console.log('Redis client connected'));
redisClient.on('error', err => console.log('Redis client error: ' + err));
redisClient.flushall(function (err, res) {
  const gameState = [
    { col: 0, row: 0, piece: { type: 'R', color: 'black' } },
    { col: 1, row: 0, piece: { type: 'H', color: 'black' } },
    { col: 2, row: 0, piece: { type: 'B', color: 'black' } },
    { col: 3, row: 0, piece: { type: 'Q', color: 'black' } },
    { col: 4, row: 0, piece: { type: 'K', color: 'black' } },
    { col: 5, row: 0, piece: { type: 'B', color: 'black' } },
    { col: 6, row: 0, piece: { type: 'H', color: 'black' } },
    { col: 7, row: 0, piece: { type: 'R', color: 'black' } },
    { col: 0, row: 1, piece: { type: 'P', color: 'black' } },
    { col: 1, row: 1, piece: { type: 'P', color: 'black' } },
    { col: 2, row: 1, piece: { type: 'P', color: 'black' } },
    { col: 3, row: 1, piece: { type: 'P', color: 'black' } },
    { col: 4, row: 1, piece: { type: 'P', color: 'black' } },
    { col: 5, row: 1, piece: { type: 'P', color: 'black' } },
    { col: 6, row: 1, piece: { type: 'P', color: 'black' } },
    { col: 7, row: 1, piece: { type: 'P', color: 'black' } },
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
    { col: 0, row: 6, piece: { type: 'P', color: 'white' } },
    { col: 1, row: 6, piece: { type: 'P', color: 'white' } },
    { col: 2, row: 6, piece: { type: 'P', color: 'white' } },
    { col: 3, row: 6, piece: { type: 'P', color: 'white' } },
    { col: 4, row: 6, piece: { type: 'P', color: 'white' } },
    { col: 5, row: 6, piece: { type: 'P', color: 'white' } },
    { col: 6, row: 6, piece: { type: 'P', color: 'white' } },
    { col: 7, row: 6, piece: { type: 'P', color: 'white' } },
    { col: 0, row: 7, piece: { type: 'R', color: 'white' } },
    { col: 1, row: 7, piece: { type: 'H', color: 'white' } },
    { col: 2, row: 7, piece: { type: 'B', color: 'white' } },
    { col: 3, row: 7, piece: { type: 'Q', color: 'white' } },
    { col: 4, row: 7, piece: { type: 'K', color: 'white' } },
    { col: 5, row: 7, piece: { type: 'B', color: 'white' } },
    { col: 6, row: 7, piece: { type: 'H', color: 'white' } },
    { col: 7, row: 7, piece: { type: 'R', color: 'white' } },
  ];
  redisClient.rpush("gameState", gameState.map(obj => JSON.stringify(obj)));
});

app.get('/', (req, res) => {
  res.send('API working');
});

engine.onmessage = function (line) {

  if (typeof line !== "string") {
    return;
  }
  if (!uciok && line === "uciok") {
    uciok = true;
    if (position) {
      send("position " + position);
      send('d');
      // d will return the fen and will be caught by the next block of code.
      // d should be sent every time someone make a move. Here is the only time at uciok, because we need the initial fen.
    }
  }
  else if (uciok && line.indexOf("Fen") > -1) {
    position = line.match(/Fen: [a-zA-Z0-9\ \/]+ [bw]+/)[0].substring(5);
    websocket.emit('currentFen', position);
    if (position[position.length - 1] === 'b') {
      //         websocket.emit('bestMove', "here!");
      send("go movetimes 4000");
    }
  }
  else if (line.indexOf("bestmove") > -1) {
    //     websocket.emit('bestMove', line);
    let match = line.match(/bestmove\s+(\S+)/);
    if (match) {
      websocket.emit('bestMove', match[1]);
    }
  }
};

let numPlayer = 0;
// When a socket is connected ...
websocket.on('connection', (socket) => {

  pvp = socket.handshake.query.pvp === 'true';

  numPlayer++;
  if (!pvp) {
    socket.emit('setPlayer', 'white');
    send("uci");
  } else if (numPlayer === 1) {
    socket.emit('setPlayer', 'white');
  } else if (numPlayer === 2) {
    socket.emit('setPlayer', 'black');
    //StockFish AI Engine
    //     send("uci");
  } else if (numPlayer > 2) {
    socket.emit('setPlayer', 'viewer');
  }
  // ... Get game state and send to client
  redisClient.lrange('gameState', 0, -1, function (err, reply) {
    socket.emit('gameState', reply.map(obj => JSON.parse(obj)));
  });

  // When a socket emits a makeMove event
  socket.on('makeMove', (data) => {
    console.log('Moving from cell ' + data.startCell + ' to ' + data.endCell);
    redisClient.lindex('gameState', data.startCell, function (err, reply) {
      let firstCell = JSON.parse(reply);
      redisClient.lindex('gameState', data.endCell, function (err, reply) {
        let secondCell = JSON.parse(reply);

        redisClient.lrange('gameState', 0, -1, function (err, reply) {

          // Get current gameState
          let gameState = reply.map(obj => JSON.parse(obj));

          // Check if move is valid with the current gameState
          let validMove = validateMove(firstCell, secondCell, gameState, currentPlayer);

          // Update move if move is valid
          if (validMove) {
            // Update gameState
            redisClient.lset('gameState', data.startCell, JSON.stringify({ ...firstCell, piece: null }));
            redisClient.lset('gameState', data.endCell, JSON.stringify({
              ...secondCell,
              piece: firstCell.piece
            }));
            // Broadcast new gameState to all sockets
            redisClient.lrange('gameState', 0, -1, function (err, reply) {
              websocket.emit('gameState', reply.map(obj => JSON.parse(obj)));
            });
            currentPlayer = currentPlayer === "white" ? "black" : "white";
            // Send instruction to plotter
            let instruction = generateInstruction(firstCell, secondCell);
            // This address changes everytime when ngrok restarts
            fetch('https://8e45c326.ngrok.io/movePlotter', {
              method: 'POST',
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              body: JSON.stringify({ instructions: instruction })
            });
            //Update game state in stockfish.
            if (!pvp) {
              send("position fen " + position + " moves " + translateMoveToUCI(firstCell, secondCell));
              send('d');
            }
          } else {
            // Otherwise, the move is invalid ...
            // ... return empty list to indicate move failed
            socket.emit('gameState', []);
          }
        });
      });
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`listening on *:${PORT}`));

/************************************************************************************************************
 * Functions for Validating Move
 ************************************************************************************************************/

function validateMove(firstCell, secondCell, gameState, player) {
  // Check first cell contains piece
  if (firstCell.piece == null) return false;
  // Check that player is moving their own chess
  if (firstCell.piece.color !== player) return false;
  // Check the two cells are different
  if (firstCell.col === secondCell.col && firstCell.row === secondCell.row) return false;
  // Check second cell does not contain piece of same color
  if (secondCell.piece && firstCell.piece.color === secondCell.piece.color) return false;

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
  console.log('Validating King Move ...');
  // A move from (C1, R1) to (C2, R2) is valid iff |C1-C2| <= 1 and |R1-R2| <= 1
  return Math.abs(firstCell.col - secondCell.col) <= 1 &&
    Math.abs(firstCell.row - secondCell.row) <= 1
}

function validateQueen(firstCell, secondCell, gameState) {
  console.log('Validating Queen Move ...');
  // A move is valid if it is a valid move for root or valid move for bishop
  return validateRook(firstCell, secondCell, gameState) || validateBishop(firstCell, secondCell, gameState);
}

function validateBishop(firstCell, secondCell, gameState) {
  console.log('Validating Bishop Move ...');
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
    for (let col = minCol + 1, row = minRow + 1; col < maxCol; col++ , row++) {
      let cell = getCell(col, row, gameState);
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
      // ... To make sure there are no other pieces on the path
      if (cell.piece) return false;
    }
  }

  // Pass all checks
  return true;
}

function validateHorse(firstCell, secondCell) {
  console.log('Validating Horse Move ...');
  // A move from (C1, R1) to (C2, R2) is valid iff
  // |C1-C2| == 1 and |R1-R2| == 2  OR |C1-C2| == 2 and |R1-R2| == 1
  return (Math.abs(firstCell.col - secondCell.col) === 1 && Math.abs(firstCell.row - secondCell.row) === 2) ||
    (Math.abs(firstCell.col - secondCell.col) === 2 && Math.abs(firstCell.row - secondCell.row) === 1);
}

function validateRook(firstCell, secondCell, gameState) {
  console.log('Validating Rook Move ...');
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
      // ... To make sure there are no other pieces on the path ...
      if (cell.piece) return false;
    }
  } else {
    // Otherwise, start and end cells are in the same row
    let row = firstCell.row;
    // ... Check each cell on the path in the same row ...
    let minCol = Math.min(firstCell.col, secondCell.col);
    let maxCol = Math.max(firstCell.col, secondCell.col);
    // ... Excluding start and end cell ...
    for (let col = minCol + 1; col < maxCol; col++) {
      let cell = getCell(col, row, gameState);
      // ... To make sure there are no other pieces on the path ...
      if (cell.piece) return false;
    }
  }
  // Pass all checks
  return true;
}

function validatePawn(firstCell, secondCell) {
  console.log('Validating Pawn Move ...');

  let rowDifference = Math.abs(firstCell.row - secondCell.row);
  let colDifference = Math.abs(firstCell.col - secondCell.col);

  // Pawn can have three valid moves:
  // 1. One step forward
  let moveOne = colDifference === 0 && rowDifference === 1;
  // 2. Two steps forward (When in starting position)
  let moveTwo = colDifference === 0 && rowDifference === 2;
  // 3. Capture enemy piece
  let capture = secondCell.piece && (firstCell.piece.color !== secondCell.piece.color)
    && (rowDifference === 1) && (colDifference === 1);
  //If the piece is black ...
  if (firstCell.piece.color === 'black') {
    let moveForward = firstCell.row < secondCell.row;
    // ... and it is in starting position ...
    if (firstCell.row === 1) {
      return moveForward && (moveOne || moveTwo || capture);
    } else {
      return moveForward && (moveOne || capture);
    }
  } else {
    //Otherwise. the piece is white
    let moveForward = secondCell.row < firstCell.row;
    // ... and it is in starting position ...
    if (firstCell.row === 6) {
      return moveForward && (moveOne || moveTwo || capture);
    } else {
      return moveForward && (moveOne || capture);
    }
  }
}

/************************************************************************************************************
 * Functions for Generating Instruction to Plotter
 ************************************************************************************************************/
// TODO: Refractor function, make direction an enum.
function generateMoveInstruction(from, to, pistolStatus) {
  let startX = from.row;
  let startY = from.col;
  let endX = to.row;
  let endY = to.col;
  let command = '';
  command = command + "2010#4010#";
  if (endX <= startX) {
    command = command + '0' + String((startX - endX) * 2) + pistolStatus + '#'
  } else {
    command = command + '4' + String((endX - startX) * 2) + pistolStatus + '#'
  }
  if (endY <= startY) {
    command = command + '6' + String((startY - endY) * 2) + pistolStatus + '#'
  } else {
    command = command + '2' + String((endY - startY) * 2) + pistolStatus + '#'
  }
  command = command + "0010#6010#";
  return command;
}


// TODO: Return instruction code to plotter
function generateInstruction(startCell, endCell) {
  let origin = { col: 0, row: 0, piece: null };
  return (generateMoveInstruction(origin, startCell, '0')
    + generateMoveInstruction(startCell, endCell, '1')
    + generateMoveInstruction(endCell, origin, '1'));
  // let instructionSet = '';
  // let startRow = startCell.row;
  // let startCol = startCell.col;
  // let endRow = endCell.row;
  // let endCol = endCell.col;
  // // 1. Start from (0.0), go to (startRow, 0): Goes South, move "startRow" units, turn off the magnets.
  // let gotoStartRow = '4' + startRow + '0#';
  // // 2. From (startRow, 0) go to (startRow, startCol): Goes East, move "startCol" units, turn off the magnets.
  // let gotoStartCol = '2' + startCol + '0#';
  // // 3. Then from (startRow, startCol) to (endRow, startCol)
  // let startToEndRow = '';
  // let rowDistance = endRow - startRow;
  // if (rowDistance <= 0) {
  //   rowDistance = rowDistance * -1;
  //   // rowDistance <=0: North, move "rowDistance" units, turn on magnets.
  //     startToEndRow = '0' + rowDistance + '1#'
  // } else {
  //   // Else go south, others remain the same.
  //     startToEndRow = '4' + rowDistance + '1#'
  // }
  // // 4. Then from (endRow, startCol) to (endRow, endCol)
  // let startToEndCol = '';
  // let colDistance = endCol - startCol;
  // if (colDistance <= 0) {
  //   colDistance = colDistance * -1;
  //   // colDistance <=0: West, move "colDistance" units, turn on magnets.
  //   startToEndCol = '6' + colDistance + '1#'
  // } else {
  //   // Else go East, others remain the same.
  //     startToEndCol = '2' + colDistance + '1#'
  // }
  // // 5. Go back to original point.
  // let resetToOriginal = '000#';
  //
  // instructionSet = gotoStartRow + gotoStartCol + startToEndRow + startToEndCol;
  // return instructionSet;
}