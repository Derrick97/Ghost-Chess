import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class ChessBoard extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(64).fill(null),
    //     };
    // }
    
    // renderSquare(i {
    //     return (
    //         <Square
    //             value={this.state.squares[i]}
    //             onClick={() =>this.handleClick(i)}
    //         />
    //     )
    // })


    render() {
        return (
        <View style={styles.container}>
            <Text>Helo</Text>
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