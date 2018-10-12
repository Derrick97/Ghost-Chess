import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Board from './components/Board';

export default class App extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <View style={styles.container}>
        <Board/>
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
