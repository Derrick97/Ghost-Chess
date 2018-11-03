import React from 'react';
import { Text, View } from 'react-native';
import Board from './Board';
import styled from 'styled-components';

export default class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      gameState: null,
      player: 'white',
      showInvalidText: false,
    }
    this.updateGameState = this.updateGameState.bind(this);
  }

  componentDidMount() {
    fetch('https://ghost-chess.herokuapp.com/getGameState')
      .then(res => res.json())
      .then(json => this.setState({ gameState: json }));
  }

  updateGameState(startCell, endCell) {
    // ... Send start and end cell to server to make move
    fetch('https://ghost-chess.herokuapp.com/makeMove', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startCell: startCell,
        endCell: endCell,
        player: this.state.player
      })
    })
      .then(res => res.json())
      .then(gameState => {
        // Server returns list of GameState, indicating move is valid
        if (gameState.length) {
          // Update the gamestate and change player
          this.setState({
            gameState: gameState,
            player: this.state.player === "white" ? "black" : "white",
            showInvalidText: false
          });
        } else {
          // Otherwise, the move is invalid
          this.setState({ showInvalidText: true });
        }      
      });
  }

  render() {
    return (
      <View >
        <Text>Player: {this.state.player}</Text>
        {
          this.state.showInvalidText &&
          <Text> Invalid Move! </Text>
        }
        <Board gameState={this.state.gameState}
          updateGameState={this.updateGameState} />
      </View>
    );
  }



}