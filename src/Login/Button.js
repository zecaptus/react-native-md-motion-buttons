import React, { Component, Children } from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  ActivityIndicator,
  UIManager,
  findNodeHandle,
} from 'react-native';
import { Easing } from '../utils';
import Ripple from '../Ripple';
import PropTypes from 'prop-types';

export default class Button extends Component {
  static propTypes = {
    style: props => {
      const style = StyleSheet.flatten(props.style);
      if (!style.hasOwnProperty('backgroundColor'))
        throw new Error(
          'Missing `backgroundColor` in `style` prop in `Login.Button`',
        );
    },
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    color: PropTypes.string,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    color: 'white',
    title: 'Login',
  };

  constructor(props) {
    super(props);

    this.buttonWidth = new Animated.Value(props.loading ? 1 : 0);
    console.log('ripple', Ripple);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  shouldComponentUpdate(newProps) {
    const { loading } = this.props;

    return !(loading && !newProps.loading);
  }

  componentWillReceiveProps(newProps) {
    const { loading } = this.props;

    if (!loading && newProps.loading) this.load();
    if (loading && !newProps.loading) this.unload(() => this.forceUpdate());
  }

  componentDidMount() {
    setTimeout(() => {
      UIManager.measure(findNodeHandle(this), (fx, fy, width, height, px, py) =>
        this.setState({ px, py, width, height }),
      );
    }, 0);
  }

  load = callback => this.animate(0, 1, callback);
  unload = callback => this.animate(1, 0, callback);

  animate = (start, end, callback) => {
    this.buttonWidth.setValue(start);
    Animated.timing(this.buttonWidth, {
      toValue: end,
      duration: 200,
      easing: Easing.Standard,
    }).start(callback);
  };

  _onPressButton = () => {
    const { loading, onPress } = this.props;

    if (!loading) onPress(this.button);
  };

  reset = () => this.buttonWidth.setValue(0);

  render() {
    const { style, color, title, loading, rippleMask } = this.props;
    const { width, height } = this.state;

    const anim = this.buttonWidth.interpolate({
      inputRange: [0, 1],
      outputRange: [width, height],
    });

    const animationStyle = width !== 0 ? { width: anim } : {};

    return (
      <Ripple
        onPress={this._onPressButton}
        style={[style, animationStyle]}
        masked={rippleMask}
        rippleColor={color}
      >
        {!loading ? (
          <Text style={{ color }}>{title}</Text>
        ) : (
          <ActivityIndicator color={color} />
        )}
      </Ripple>
    );
  }
}
