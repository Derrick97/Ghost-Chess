import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
// import Board from './components/Board';
import ChessBoard from './ChessBoard';

export default class App extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <View style={styles.container}>
      <ChessBoard/>
        {/* <Board/> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

        // {/* Example of calling API using node fetch */}
        // <Button title="Get GameState" onPress={() => {
        //   fetch('https://ghost-chess.herokuapp.com/getGameState')
        //     .then(res => res.text())
        //     .then(text => this.setState({ text: text }));
        // }} />