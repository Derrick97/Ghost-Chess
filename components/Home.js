import React from 'react';
import { , View, StyleSheet, Button } from 'react-native';

export default class Home extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Versus Player"
          onPress={() =>
            this.props.navigation.navigate('VersusPlayer', { pvp: true })
          }
        />
        <Button
          title="Versus AI"
          onPress={() =>
            this.props.navigation.navigate('VersusAI', { pvp: false })
          }
        />
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});