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
    Button,
    StatusBar
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
  constructor(props){
    super(props);

  }

  render() {
    const promise = () => new Promise((resolve, reject) => setTimeout(() => resolve(), 2000) );

    console.log("login", Login);
    return (
        <Login.View style={styles.container} homeScreen={<Home />}>
          <StatusBar translucent={true} backgroundColor='rgba(255, 255, 255, .2)' barStyle="dark-content" />

          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Text style={styles.instructions}>
            To get started, edit index.android.js
          </Text>
          <Text style={styles.instructions}>
            Double tap R on your keyboard to reload,{'\n'}
            Shake or press menu button for dev menu
          </Text>

          <Login.Button
              title="Login"
              onPress={promise}
              style={styles.button}
              rippleMask={{borderRadius:25, mainBgColor: "#F5FCFF"}}
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
