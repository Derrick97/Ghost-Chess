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
    }
    this.firstIndex = null;
    this.secondIndex = null;
    this.handleCellPress = this.handleCellPress.bind(this)
  }

  componentDidMount() {
    fetch('https://ghost-chess.herokuapp.com/getGameState')
      .then(res => res.json())
      .then(json => this.setState({ gameState: json }));
  }

  handleCellPress(index) {
    // If no chess piece is selected ...
    if (this.firstIndex === null) {
      if (this.state.gameState[index].piece !== null) {
        // ... set start cell to cell index
        this.firstIndex = index;
      }
    } else {
      // Otherwise, chess piece is already selected ...
      this.secondIndex = index;
      // ... Send start and end cell to server to make move
      fetch('https://ghost-chess.herokuapp.com/makeMove', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstIndex: this.firstIndex, secondIndex: this.secondIndex })
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ gameState: json });
          this.firstIndex = null;
          this.secondIndex = null;
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
              handleCellPress={this.handleCellPress}
               />);
          })
        }
      </StyledBoard>
    )
  }

}