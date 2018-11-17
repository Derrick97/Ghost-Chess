import React from 'react';
import {Text, View} from 'react-native';
import Board from './Board';
import styled from 'styled-components';

const io = require('socket.io-client');

export default class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            gameState: null,
            player: 'black',
        };
        this.me = '';
        this.bestMove = '';
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
                });
            }
        });

        this.socket.on('setPlayer', data => {
            this.me = data;
        });

        this.socket.on('bestMove', data => {
            this.bestMove = data;
        });

        this.socket.on('currentFen', data => {
            this.currentFen = data;
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
            <View>
                <Text>Player: {this.state.player}</Text>
                <Text>Me: {this.me} </Text>
                <Board gameState={this.state.gameState}
                       updateGameState={this.updateGameState}
                       me={this.me}/>
                <Text>BestMove: {this.bestMove}</Text>
                <Text>Current: {this.currentFen}</Text>
            </View>
        );
    }


}