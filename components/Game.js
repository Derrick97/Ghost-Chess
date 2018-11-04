import React from 'react';
import { Text, View } from 'react-native';
import Board from './Board';
import styled from 'styled-components';
const io = require('socket.io-client');

export default class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      gameState: null,
      player: 'white',
      invalidMoveMessage: '',
    }
    this.updateGameState = this.updateGameState.bind(this);
    this.socket = io('https://ghost-chess.herokuapp.com', {
      transports: ['websocket'],
    });
  }

  componentDidMount() {
    this.socket.on('gameState', data => {
      // Server returns list of GameState, indicating move is valid
      if (data.length) {
        // Update the gamestate and change player
        this.setState({
          gameState: data,
          player: this.state.player === "white" ? "black" : "white",
          invalidMoveMessage: ''
        });
      } else {
        // Otherwise, the move is invalid
        this.setState({ invalidMoveMessage: 'Invalid Move!' });
      }     
    });

    /*
    fetch('https://ghost-chess.herokuapp.com/getGameState')
      .then(res => res.json())
      .then(json => this.setState({ gameState: json }));
    */
  }

  updateGameState(startCell, endCell) {
    this.socket.emit('makeMove',
      {
        startCell: startCell,
        endCell: endCell,
        player: this.state.player
      }
    );


    /*
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
            invalidMoveMessage: ''
          });
        } else {
          // Otherwise, the move is invalid
          this.setState({ invalidMoveMessage: 'Invalid Move!' });
        }      
      });
      */
  }

  render() {
    return (
      <View >
        <Text>Player: {this.state.player}</Text>
        <Text> {this.state.invalidMoveMessage} </Text>
        <Board gameState={this.state.gameState}
          updateGameState={this.updateGameState} />
      </View>
    );
  }



}