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
  View,
  Button
} from 'react-native';
import { Login } from 'react-native-md-motion-buttons';

class Home extends Component {
  render() {
    return (<View style={[StyleSheet.absoluteFill, styles.container]}>
      <Text style={styles.welcome}>
        New screen
      </Text>
      <Button title="Reset" onPress={this.props.logout} />

    </View>)
  }
}

export default class examples extends Component {
  render() {
    const promise = () => new Promise((resolve, reject) => setTimeout(() => resolve(), 2000) );

    return (
        <Login.View style={styles.container} homeScreen={<Home />}>

          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Text style={styles.instructions}>
            To get started, edit index.ios.js
          </Text>
          <Text style={styles.instructions}>
            Press Cmd+R to reload,{'\n'}
            Cmd+D or shake for dev menu
          </Text>

          <Login.Button
              test="ripple"
              onPress={promise}
              style={styles.button}
              color="rgb(255,155,57)" />

        </Login.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 40,
    marginRight: 20,
    marginLeft: 20,
    width: 300,
    justifyContent: 'center',
    backgroundColor: "#380b22"
  },
});

AppRegistry.registerComponent('examples', () => examples);
