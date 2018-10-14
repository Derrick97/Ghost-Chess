import React from 'react';
import {Text, View} from 'react-native';
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
            clicked: false,
            storedIndex: null,
        }
        this.handleCellPress = this.handleCellPress.bind(this)
        // this.updateView = this.updateView.bind(this)
    }


    handleCellPress(index) {

        if (this.state.clicked === false) {
            if (this.state.gameState[index].piece !== null) {
                this.setState({
                    clicked: true,
                    storedIndex: index
                });
            }
        } else {
            var body = {
                firstIndex: this.state.storedIndex,
                secondIndex: index
            };
            fetch('https://ghost-chess.herokuapp.com/makeMove', {
                method: 'POST',
                body: body,
            })
                .then(res => res.json())
                .then(json => this.setState({gameState: json}));
            this.setState({
                clicked: false,
            })
        }
    }

    // test(json) {
    //     console.log(json);
    // }
    //To use the JSON object returned from the server and update the board state
    // updateView(json) {
    //     this.setState({gameState: json})
    // }

    componentDidMount() {
        fetch('https://ghost-chess.herokuapp.com/getGameState')
            .then(res => res.json())
            .then(json => this.setState({gameState: json}));
    }

    render() {
        return (
            <StyledBoard>
                {
                    this.state.gameState &&
                    this.state.gameState.map((cell, index) => {
                        return (<Cell key={index} id={index} handleCellPress={this.handleCellPress} col={cell.col}
                                      row={cell.row} piece={cell.piece}/>);
                    })
                }
            </StyledBoard>
        )
    }

}