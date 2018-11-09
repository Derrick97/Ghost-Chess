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
      player: 'black',
      invalidMoveMessage: '',
    };
    this.me = '';
    this.updateGameState = this.updateGameState.bind(this);
    // Establish socket connection
    this.socket = io('https://ghost-chess.herokuapp.com', {
      transports: ['websocket'],
    });
  }

  componentDidMount() {
    // When socket recieves gameState event from server ...
    this.socket.on('gameState', data => {
      // If server returns list of GameState, indicating move is valid
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

    this.socket.on('setPlayer', data => {
      this.me = data;
    });
  }

  updateGameState(startCell, endCell) {
    // Emit makeMove event to server
    this.socket.emit('makeMove',
      {
        startCell: startCell,
        endCell: endCell,
        player: this.state.player
      }
    );
  }

  render() {
    return (
      <View >
        <Text>Player: {this.state.player}</Text>
        <Text> {this.state.invalidMoveMessage} </Text>
		<Text>Me: {this.me} </Text>
        <Board gameState={this.state.gameState}
          updateGameState={this.updateGameState}
          me={this.me}/>
      </View>
    );
  }



}