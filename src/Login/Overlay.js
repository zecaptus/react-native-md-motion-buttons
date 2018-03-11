import React, { Component, Children } from 'react';
import {
  StyleSheet,
  Animated,
  UIManager,
  findNodeHandle,
  Dimensions,
} from 'react-native';
import { Easing } from '../utils';
import PropTypes from 'prop-types';

export default class Overlay extends Component {
  constructor(props) {
    super(props);

    this.overlayZoom = new Animated.Value(0);
    this.overlayFade = new Animated.Value(1);

    this.state = {
      top: 0,
      left: 0,
    };
  }

  init(button) {
    const { onTransition } = this.props;
    const window = Dimensions.get('window');

    UIManager.measure(
      findNodeHandle(button),
      (fx, fy, width, height, px, py) => {
        let _top = (top = py + height / 2);
        let _left = (left = px + width / 2);

        // bottom left button => NP
        // left button
        if (left < window.width / 2) {
          _left = window.width - left;
        }
        // top button
        if (top < window.height / 2) {
          _top = window.height - top;
        }

        this.setState(
          {
            top,
            left,
            height: Math.sqrt(_top * _top + _left * _left) * 2,
          },
          () => this.zoomIn(onTransition),
        );
      },
    );
  }

  zoomIn = callback => this.zoom(0, 1, callback);
  zoomOut = callback => this.zoom(1, 0, callback);
  fadeIn = callback => this.fade(0, 1, callback);
  fadeOut = callback => this.fade(1, 0, callback);

  zoom = (start, end, callback) => {
    const { height } = this.state;

    this.overlayZoom.setValue(start);
    Animated.timing(this.overlayZoom, {
      toValue: end,
      duration: height / 5 || 200,
      easing: Easing.Deceleration,
    }).start(callback);
  };

  fade = (start, end, callback) => {
    this.overlayFade.setValue(start);
    Animated.timing(this.overlayFade, {
      toValue: end,
      duration: 100,
      easing: Easing.Standard,
    }).start(callback);
  };

  reset = () => {
    this.overlayZoom.setValue(0);
    this.overlayFade.setValue(1);
  };

  render() {
    const { top, left, height } = this.state;
    const { color } = this.props;
    const inputRange = [0, 1];
    const size = this.overlayZoom.interpolate({
      inputRange,
      outputRange: [0, height],
    });
    const middleSize = this.overlayZoom.interpolate({
      inputRange,
      outputRange: [0, height / 2],
    });
    const atop = this.overlayZoom.interpolate({
      inputRange,
      outputRange: [top, top - height / 2],
    });
    const aleft = this.overlayZoom.interpolate({
      inputRange,
      outputRange: [left, left - height / 2],
    });
    const _color = this.overlayFade.interpolate({
      inputRange,
      outputRange: ['transparent', color],
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          borderRadius: middleSize,
          width: size,
          height: size,
          top: atop,
          left: aleft,
          backgroundColor: _color,
        }}
      />
    );
  }
}
