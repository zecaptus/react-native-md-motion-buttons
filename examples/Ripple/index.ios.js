/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Ripple } from 'react-native-md-motion-buttons';

export default class RippleExp extends Component {
  render() {
    return (
        <View style={styles.container}>
            <Ripple style={styles.test} rippleColor="white">
                <Text>Not rounded{'\n'}White ripple</Text>
            </Ripple>
            <Ripple style={styles.test} rippleColor="purple">
                <Text>Not rounded{'\n'}Purple ripple</Text>
            </Ripple>
            <Ripple style={[styles.test, {borderRadius:10}]} rippleColor="purple">
                <Text>Rounded: 10{'\n'}Purple ripple</Text>
            </Ripple>
            <Ripple style={[styles.test, {borderRadius:25}]} rippleColor="purple">
                <Text>Rounded: 25{'\n'}Purple ripple</Text>
            </Ripple>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    test: {
        marginTop: 10,
        width: 200,
        height: 50,
        backgroundColor: 'red',
        alignItems: 'center'
    }
});

AppRegistry.registerComponent('Ripple', () => RippleExp);
