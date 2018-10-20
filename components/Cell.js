import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';

const backgroundColor = ({ col, row }) => {
  return (col + row) % 2 === 0 ? '#0F984A' : '#5AF29B';
};

const StyledCell = styled.TouchableHighlight`
    width: 40;
    height: 40;
    background-color: ${backgroundColor};
    display: flex;
    justifyContent: center;
    alignItems: center;
`;

export default class Cell extends React.Component {

  constructor() {
    super();
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    this.props.handleCellPress(this.props.id)
  }

  renderChessPiece() {
    let chessCode;
    if (this.props.piece.color === 'white') {
      chessCode = 0;
    }
    switch (this.props.piece.type) {
      case 'K':
        chessCode += 9812;
        break;
      case 'Q':
        chessCode += 9813;
        break;
      case 'R': 
        chessCode += 9814;
        break;
      case 'B': 
        chessCode += 9815;
        break;
      case 'H': 
        chessCode += 9816;
        break;
      case 'P': 
        chessCode += 9817;
        break;
    }
    return chessCode;
  }

  render() {
    return (
      <StyledCell underlayColor='grey' col={this.props.col} row={this.props.row} onPress={this.handlePress}>
        {
          this.props.piece ?
            <Text style={{ color: this.props.piece.color }}>
              {String.fromCharCode(this.renderChessPiece)}
            </Text> :
            <Text/>
        }
      </StyledCell>);
  }
}