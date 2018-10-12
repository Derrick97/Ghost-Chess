import React from 'react';
import {Text, View } from 'react-native';
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
        this.state = {gameState: null}
    }

    componentDidMount() {
        fetch('https://ghost-chess.herokuapp.com/getGameState')
            .then(res => res.json())
            .then(json => this.setState({ gameState: json }));
    }

    render() {
        return (
            <StyledBoard>
                {
                    this.state.gameState &&
                    this.state.gameState.map((cell, index) => {
                        return(<Cell key={index} col={cell.col} row={cell.row} piece={cell.piece}/>);
                    })
                }
            </StyledBoard>
        )
    }
}