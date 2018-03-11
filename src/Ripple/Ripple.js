import React, { Component } from 'react';
import {
  StyleSheet,
  Animated,
  View,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import { Easing } from '../utils';
import PropTypes from 'prop-types';

export default class Ripple extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    rippleColor: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.pressIn = new Animated.Value(0);

    this.state = {
      cpt: 0,
      ripples: [],
      x: 0,
      y: 0,
    };
  }

  onPressIn = e => {
    const { locationX, locationY } = e.nativeEvent;
    this.fadeIn();
    this.setState({ x: locationX, y: locationY });
  };

  onPressOut = () => {
    const { x, y } = this.state;
    this.fadeOut();
    this.addRipple(x, y);
  };

  onPress = e => {
    const { onPress } = this.props;

    if (onPress) onPress(e);
  };

  addRipple = (x, y) => {
    const { ripples, cpt } = this.state;

    const ripple = { index: cpt, x, y, timing: new Animated.Value(0) };

    Animated.timing(ripple.timing, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => this.setState({ ripples: ripples.slice(1) }));

    this.setState({
      ripples: [...ripples, ripple],
      cpt: cpt + 1,
    });
  };

  fadeIn = () => this.fade(1, 1300);
  fadeOut = () => this.fade(0, 500);
  fade = (toValue, duration) => {
    this.pressIn.stopAnimation();
    Animated.timing(this.pressIn, {
      toValue,
      duration,
      easing: Easing.Standard,
      useNativeDriver: true,
    }).start();
  };

  renderAndroidRoundedMask() {
    const { style, masked } = this.props;
    const { borderRadius } = StyleSheet.flatten(style);

    const styles = {
      position: 'absolute',
      top: -borderRadius,
      bottom: -borderRadius,
      right: -borderRadius,
      left: -borderRadius,
      borderRadius: borderRadius * 2,
      borderWidth: borderRadius,
      borderColor: masked,
    };

    return (
      <View style={StyleSheet.absoluteFill}>
        <View style={styles} />
      </View>
    );
  }

  renderCompatibleNative() {
    const { children, masked, rippleColor, style } = this.props;

    return (
      <TouchableNativeFeedback
        onPress={this.onPress}
        background={TouchableNativeFeedback.Ripple(rippleColor)}
      >
        <Animated.View style={style} pointerEvents="box-only">
          {masked ? this.renderAndroidRoundedMask() : null}
          {children}
        </Animated.View>
      </TouchableNativeFeedback>
    );
  }

  renderRipple = ({ index, x, y, timing }) => {
    const { rippleColor } = this.props;

    const styleRipple = {
      position: 'absolute',
      top: y - 5,
      left: x - 5,
      backgroundColor: rippleColor,
      width: 10,
      height: 10,
      borderRadius: 5,
      transform: [
        {
          scale: timing.interpolate({
            inputRange: [0, 1],
            outputRange: [0.01, 20],
          }),
        },
      ],
      opacity: timing.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 0],
      }),
    };

    return <Animated.View key={index} style={styleRipple} />;
  };

  renderDefault() {
    const { children, style, masked, rippleColor } = this.props;
    const { ripples } = this.state;
    const { borderRadius } = StyleSheet.flatten(style);

    const opacity = this.pressIn.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    });

    return (
      <TouchableWithoutFeedback
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        onPress={this.onPress}
      >
        <Animated.View style={style} pointerEvents="box-only">
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: rippleColor,
                opacity,
                borderRadius,
                overflow: 'hidden',
              },
            ]}
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              { borderRadius, overflow: 'hidden' },
            ]}
          >
            {ripples.map(this.renderRipple)}
            {Platform.OS === 'android' && masked
              ? this.renderAndroidRoundedMask()
              : null}
          </View>
          <View style={{ backgroundColor: 'transparent' }}>{children}</View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return Platform.OS === 'android' && Platform.Version > 21
      ? this.renderCompatibleNative()
      : this.renderDefault();
  }
}
