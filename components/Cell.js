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

  render() {
    return (
      <StyledCell underlayColor='grey' col={this.props.col} row={this.props.row} onPress={this.handlePress}>
        {
          this.props.piece ?
            <Text style={{ color: this.props.piece.color }}>
              {this.props.piece.type}
            </Text> :
            <Text/>
        }
      </StyledCell>);
  }
}