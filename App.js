import React from 'react';
import { StyleSheet} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './components/Home';
import Game from './components/Game';


const Navigator = createStackNavigator({
  Home: { screen: Home },
  VersusPlayer: { screen: Game },
  VersusAI: { screen: Game }
});

const App = createAppContainer(Navigator);

export default App;

