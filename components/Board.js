import React from 'react';
import { Text, View } from 'react-native';
import Cell from './Cell';
import styled from 'styled-components';

const StyledBoard = styled.View`
    width: 320;
    display: flex;
    flexFlow: row wrap;
    justifyContent: space-between;
`;

export default class Board extends React.Component {


  constructor() {
    super();
    this.state = {
      gameState: null,
      highlightedCells: [],
    };
    this.startCell = null;
    this.endCell = null;
    this.handleCellPress = this.handleCellPress.bind(this)
  }

  componentDidMount() {
    fetch('https://ghost-chess.herokuapp.com/getGameState')
      .then(res => res.json())
      .then(json => this.setState({ gameState: json }));
  }

  // Returns the Cell object with the specified column and row from a given GameState
  getCell(col, row) {
    return this.state.gameState.find(function (cell) {
      return cell.col === col && cell.row === row
    });
  }

  // Returns true if two cells have pieces with the same color.
  checkSamePieceColor(cell1, cell2) {
    return cell1.piece !== null && cell2.piece !== null && cell1.piece.color === cell2.piece.color;
  }

  // Returns true if the col and row lies inside the board.
  checkInsideBoard(col, row) {
    return col >= 0 && row >= 0 && col <= 7 && row <= 7;
  }

  // Returns the valid cell if the possible move is a valid move.
  checkValidMove(cell, col, row) {
    if (this.checkInsideBoard(col, row)) {
      let possibleCell = this.getCell(col, row);
      if (!this.checkSamePieceColor(cell, possibleCell)) {
        return possibleCell;
      }
    }
    return null;
  }

  checkValidMoveForPawn(cell, col, row) {
    if (this.checkInsideBoard(col, row)) {
      let possibleCell = this.getCell(col, row);
      if (possibleCell.piece === null) {
        return possibleCell;
      }
    }
    return null;
  }

  findValidMove(cell) {
    // Initailize ValidMove to an empty array
    let validMoves = [];
    switch (cell.piece.type) {
      case 'K': // King
        validMoves = this.findValidKing(cell);
        break;
      case 'Q': // Queen
        validMoves = this.findValidQueen(cell);
        break;
      case 'B': // Bishop
        validMoves = this.findValidBishop(cell);
        break;
      case 'H': // Horse
        validMoves = this.findValidHorse(cell);
        break;
      case 'R': // Rook
        validMoves = this.findValidRook(cell);
        break;
      case 'P': // Pawn
        validMoves = this.findValidPawn(cell);
        break;
      default:
        console.log('Error Piece Detected');
    }
    return validMoves;
  }

  findValidKing(cell) {
    let validMoves = [];
    // A move from (C1, R1) to (C2, R2) is valid iff |C1-C2| <= 1 and |R1-R2| <= 1
    for (let col = cell.col - 1; col <= cell.col + 1; col++) {
      for (let row = cell.row - 1; row <= cell.row + 1; row++) {
        let validMove = this.checkValidMove(cell, col, row);
        if (validMove !== null) {
          validMoves.push(validMove);
        }
      }
    }
    return validMoves;
  }

  findValidQueen(cell) {
    // A move is valid if it is a valid move for root or valid move for bishop
    let validMoves = [];
    validMoves.push(...this.findValidRook(cell));
    validMoves.push(...this.findValidBishop(cell));
    return validMoves;
  }

  findValidBishop(cell) {
    // Bishop can move in 4 directions: NW, SW, NE, SE
    let directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    let validMoves = [];
    // For each direction ...
    for (let i = 0; i < directions.length; i++) {
      let direction = directions[i];
      // ... make a step forward ...
      for (let step = 1; step < 8; step++) {
        let col = cell.col + direction[0] * step;
        let row = cell.row + direction[1] * step;
        // ... If this step is a valid move ...
        let possibleCell = this.checkValidMove(cell, col, row);
        if (possibleCell) {
          // ... add this to validMoves ...
          validMoves.push(possibleCell);
          // ... If the end cell contains a piece, stop moving forward and change direction
          if (possibleCell.piece) {break}
        } else {
          // Otherwise, the cell is invalid...
          // ... change direction
          break;
        }
      }
    }
    return validMoves;
  }

  findValidHorse(cell) {
    let moves = [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [-2,1], [2,-1], [-2,-1]]
    let validMoves = [];
    for (let i = 0; i < moves.length; i++) {
      let col = cell.col + moves[i][0];
      let row = cell.row + moves[i][1];
      let validMove = this.checkValidMove(cell, col, row);
      if (validMove !== null) {
        validMoves.push(validMove);
      }
    }
    return validMoves;
  }

  findValidRook(cell) {
    // Rook can move in 4 directions: N, E, S, W
    let directions = [[0, -1], [0, 1], [1, 0], [-1, 0]];
    let validMoves = [];

    // For each direction ...
    for (let i = 0; i < directions.length; i++) {
      let direction = directions[i];
      // ... make a step forward ...
      for (let step = 1; step < 8; step++) {
        let col = cell.col + direction[0] * step;
        let row = cell.row + direction[1] * step;
        // ... If this step is a valid move ...
        let possibleCell = this.checkValidMove(cell, col, row);
        if (possibleCell) {
          // ... add this to validMoves ...
          validMoves.push(possibleCell);
          // ... If the end cell contains a piece, stop moving forward and change direction
          if (possibleCell.piece) { break }
        } else {
          // Otherwise, the cell is invalid...
          // ... change direction
          break;
        }
      }
    }
    return validMoves;
  }

  findValidPawn(cell) {
    let validMoves = [];

    let col = cell.col;
    //The piece is white
    if (cell.piece.color === 'white') {
      //On the starting row
      if (cell.row === 1) {
        let row = cell.row + 2;
        let cellInFront = this.getCell(col, cell.row + 1);
        if (cellInFront.piece !== null) {
          return [];
        }
        let validMove = this.checkValidMoveForPawn(cell, col, row);
        if (validMove !== null) {
          validMoves.push(validMove);
        }
      }
      let row = cell.row + 1;
      let validMove = this.checkValidMoveForPawn(cell, col, row);
      if (validMove !== null) {
        validMoves.push(validMove);
      }
      // Pawn Capture
      let possibleCapture = this.checkValidMove(cell, cell.col - 1, cell.row - 1);
      if (possibleCapture !== null && possibleCapture.piece !== null) {
        validMoves.push(possibleCapture);
      }
      possibleCapture = this.checkValidMove(cell, cell.col - 1, cell.row + 1);
      if (possibleCapture !== null && possibleCapture.piece !== null) {
        validMoves.push(possibleCapture);
      }
    } else {
      //The piece is black, on starting row
      if (cell.row === 6) {
        let row = cell.row - 2;
        let cellInFront = this.getCell(col, cell.row - 1);
        if (cellInFront.piece !== null) {
          return [];
        }
        let validMove = this.checkValidMoveForPawn(cell, col, row);
        if (validMove !== null) {
          validMoves.push(validMove);
        }
      }
      let row = cell.row - 1;
      let validMove = this.checkValidMoveForPawn(cell, col, row);
      if (validMove !== null) {
        validMoves.push(validMove);
      }
      let possibleCapture = this.checkValidMove(cell, cell.col + 1, cell.row - 1);
      if (possibleCapture !== null && possibleCapture.piece !== null) {
        validMoves.push(possibleCapture);
      }
      possibleCapture = this.checkValidMove(cell, cell.col - 1, cell.row - 1);
      if (possibleCapture !== null && possibleCapture.piece !== null) {
        validMoves.push(possibleCapture);
      }
    }

    return validMoves;
  }

  handleCellPress(index) {
    // If no chess piece is selected ...
    if (this.startCell === null) {
      if (this.state.gameState[index].piece !== null) {
        // ... set start cell to cell index
        this.startCell = index;
        // TODO: possible moves
        let cell = this.state.gameState[index];
        let possibleMoves = this.findValidMove(cell);
        this.setState({ highlightedCells: possibleMoves });
      }
    } else {
      // Otherwise, chess piece is already selected ...
      this.endCell = index;
      // ... Send start and end cell to server to make move
      fetch('https://ghost-chess.herokuapp.com/makeMove', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ startCell: this.startCell, endCell: this.endCell })
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ gameState: json });
          this.startCell = null;
          this.endCell = null;
        });
    }
  }

  render() {
    return (
      <StyledBoard>
        {
          this.state.gameState &&
          this.state.gameState.map((cell, index) => {
            return (<Cell
              key={index}
              id={index}
              col={cell.col}
              row={cell.row}
              piece={cell.piece}
              isHighlighted={this.state.highlightedCells.includes(this.getCell(cell.col, cell.row))}
              handleCellPress={this.handleCellPress}
            />);
          })
        }
      </StyledBoard>
    )
  }

}