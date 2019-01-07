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
      bestMove: '',
      currentFen: '',
    };
    this.me = '';

    this.updateGameState = this.updateGameState.bind(this);
    // Establish socket connection
    this.socket = io('https://ghost-chess.herokuapp.com', {
      transports: ['websocket'],
      query: "pvp=" + JSON.stringify(navigation.getParam('pvp')) 
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
        });
      }
    });

    this.socket.on('setPlayer', data => {
      this.me = data;
    });

    this.socket.on('bestMove', data => {
      this.setState({
        bestMove: data,
      });
      let bestMove = data;
      if (bestMove.length !== 0) {
        let f_row = 8 - bestMove[1];
        let f_col = bestMove.charCodeAt(0) - "a".charCodeAt(0);
        let s_row = 8 - bestMove[3];
        let s_col = bestMove.charCodeAt(2) - "a".charCodeAt(0);
        let firstCell = f_row * 8 + f_col;
        let secondCell = s_row * 8 + s_col;
        this.socket.emit('makeMove',
          {
            startCell: firstCell,
            endCell: secondCell,
          }
        );
      }
    });

    this.socket.on('currentFen', data => {
      this.setState({
        currentFen: data,
      });
    });
  }

  updateGameState(startCell, endCell) {
    // Emit makeMove event to server
    this.socket.emit('makeMove',
      {
        startCell: startCell,
        endCell: endCell,
      }
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View>
        <Text>Player: {this.state.player}</Text>
        <Text>Me: {this.me} </Text>
        <Text>BestMove: {this.state.bestMove}</Text>
        <Board gameState={this.state.gameState}
          updateGameState={this.updateGameState}
          me={this.me} />
        <Text>Current: {this.state.currentFen}</Text>
      </View>
    );
  }


}