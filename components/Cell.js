import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';

const backgroundColor = ({ col, row, isHighlighted }) => {
    if (isHighlighted) {
        return '#1E90FF';
    }
  return (col + row) % 2 === 1 ? '#7D473B' : '#FDF2DC';
};

const StyledCell = styled.TouchableHighlight`
    width: 40;
    height: 40;
    background-color: ${backgroundColor};
    display: flex;
    justifyContent: center;
    alignItems: center;
`;

const StyledPiece = styled.Text`
    font-size: 20;
`;

function Piece(props) {
    let chessCode = props.color === "black" ? 6 : 0;
    switch (props.type) {
        case "K":
            chessCode += 9812;
            break;
        case "Q":
            chessCode += 9813;
            break;
        case "R":
            chessCode += 9814;
            break;
        case "B":
            chessCode += 9815;
            break;
        case "H":
            chessCode += 9816;
            break;
        case "P":
            chessCode += 9817;
            break;
        default:
            chessCode = 9812;
    }
    return <StyledPiece>{String.fromCharCode(chessCode)}</StyledPiece>
}

export default class Cell extends React.Component {

  constructor() {
    super();
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    this.props.handleCellPress(this.props.id)
  }

  render() {
    return (
      <StyledCell underlayColor='grey' col={this.props.col} row={this.props.row} isHighlighted={this.props.isHighlighted} onPress={this.handlePress}>
        {
          this.props.piece ? <Piece color={this.props.piece.color} type={this.props.piece.type}/> : <Text/>
        }
      </StyledCell>);
  }
}