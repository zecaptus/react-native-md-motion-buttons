import React, { Component, Children } from 'react';
import { StyleSheet, Text, View as NativeView } from 'react-native';
import { Button, Overlay } from './';
import PropTypes from 'prop-types';

export default class View extends Component {
  static propTypes = {
    homeScreen: PropTypes.element.isRequired,
    style: PropTypes.number,
    children: props => {
      const found = props.children.map(child => child.type === Button);

      if (found.indexOf(true) === -1)
        throw new Error("Can't find `Login.Button` component");
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      nextScreen: false,
      color: 'transparent',
    };
  }

  handleClick(promise) {
    const { style } = this.refs.button.props;
    const { backgroundColor } = StyleSheet.flatten(style);

    this.setState({ loading: true, color: backgroundColor });
    promise()
      .then(this.success)
      .catch(this.error);
  }

  success = () => {
    const { button, overlay } = this.refs;

    overlay.init(button);
  };

  error = () => this.setState({ loading: false });

  transition = () => {
    const { overlay } = this.refs;

    this.setState({ nextScreen: true }, () =>
      overlay.fadeOut(() => overlay.reset()),
    );
  };

  logout = () => {
    const { overlay } = this.refs;

    overlay.fadeIn(() =>
      this.setState({ nextScreen: false }, () =>
        overlay.zoomOut(() => this.setState({ loading: false })),
      ),
    );
  };

  renderChildren() {
    const { children } = this.props;
    const { loading } = this.state;

    return Children.map(children, child => {
      if (child.type === Button) {
        return React.cloneElement(child, {
          loading,
          ref: 'button',
          onPress: this.handleClick.bind(this, child.props.onPress),
        });
      } else {
        return child;
      }
    });
  }

  render() {
    const { style, homeScreen } = this.props;
    const { nextScreen, color } = this.state;

    return (
      <NativeView style={style}>
        {this.renderChildren()}
        {nextScreen
          ? React.cloneElement(homeScreen, { logout: this.logout })
          : null}
        <Overlay color={color} ref="overlay" onTransition={this.transition} />
      </NativeView>
    );
  }
}
