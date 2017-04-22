import React, { Component, Children, PropTypes } from 'react';
import {
    StyleSheet,
    Animated,
    Text,
    View as NativeView,
    TouchableWithoutFeedback,
    ActivityIndicator,
    UIManager,
    findNodeHandle,
    Dimensions
} from 'react-native';
import { Easing } from './utils';

class View extends Component {
    static propTypes = {
        homeScreen: PropTypes.element.isRequired,
        style: PropTypes.number,
        children: (props) => {
            const found = props.children.map(child => child.type === Button);

            if(found.indexOf(true) === -1)
                throw new Error('Can\'t find `Login.Button` component');
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            nextScreen: false,
            color: 'transparent'
        };
    }

    handleClick(promise) {
        const { style } = this.refs.button.props;
        const { backgroundColor } = StyleSheet.flatten(style);

        this.setState({ loading: true, color: backgroundColor });
        promise().then(this.success).catch(this.error);
    }

    success = () => {
        const { button, overlay } = this.refs;

        overlay.init(button);
    };

    error = () => this.setState({ loading: false });

    transition = () => {
        const { overlay } = this.refs;

        this.setState(
            { nextScreen: true },
            () => overlay.fadeOut(() => overlay.reset())
        );
    };

    logout = () => {
        const { overlay } = this.refs;

        overlay.fadeIn(() =>
                this.setState({ nextScreen: false }, () =>
                        overlay.zoomOut( () => this.setState({ loading: false }) )
                )
        );
    };

    renderChildren() {
        const { children } = this.props;
        const { loading } = this.state;

        return Children.map(children, child => {
            if( child.type === Button ) {
                return React.cloneElement(child, {
                    loading,
                    ref: 'button',
                    onPress: this.handleClick.bind(this, child.props.onPress)
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
                <Overlay color={color}
                         ref="overlay"
                         onTransition={this.transition} />
                {nextScreen ? React.cloneElement(homeScreen, { logout: this.logout }) : this.renderChildren()}
            </NativeView>
        )
    }

}

class Button extends Component {
    static propTypes = {
        style: (props) => {
            const style = StyleSheet.flatten(props.style);
            if(! style.hasOwnProperty('backgroundColor'))
                throw new Error('Missing `backgroundColor` in `style` prop in `Login.Button`');
        },
        title: PropTypes.string,
        onPress: PropTypes.func.isRequired,
        color: PropTypes.string,
        loading: PropTypes.bool
    };

    static defaultProps = {
        color: 'white',
        title: 'Login'
    };

    constructor(props) {
        super(props);

        this.buttonWidth = new Animated.Value(0);

        this.state = {
            width: 0,
            height: 0
        };
    }

    shouldComponentUpdate(newProps) {
        const { loading } = this.props;

        return !(loading && ! newProps.loading);
    }

    componentWillReceiveProps(newProps){
        const { loading } = this.props;

        if(! loading && newProps.loading) this.load();
        if(loading && ! newProps.loading) this.unload(() => this.forceUpdate());
    }

    componentDidMount(){
        setTimeout(() => {
            UIManager.measure(
                findNodeHandle(this),
                (fx, fy, width, height, px, py) => this.setState({width, height})
            );
        },0);
    }

    load   = (callback) => this.animate(0, 1, callback);
    unload = (callback) => this.animate(1, 0, callback);

    animate = (start, end, callback) => {
        this.buttonWidth.setValue(start);
        Animated.timing(
            this.buttonWidth,
            {
                toValue: end,
                duration: 200,
                easing: Easing.Standard
            }
        ).start(callback);
    };

    _onPressButton = () => {
        const { loading, onPress } = this.props;

        if(! loading) onPress(this.button)
    };

    reset = () => this.buttonWidth.setValue(0);

    render() {
        const { style, color, title, loading } = this.props;
        const { width, height } = this.state;

        const anim = this.buttonWidth.interpolate({
            inputRange: [0, 1],
            outputRange: [width, height]
        });

        const animationStyle = width !== 0 ? { width: anim } : {};

        return (<TouchableWithoutFeedback onPress={this._onPressButton}>
            <Animated.View
                style={[style, animationStyle]}
                ref={ref => this.button = ref}>
                {
                    (!loading)?
                        <Text style={{color}}>{title}</Text>:
                        <ActivityIndicator color={color} />
                }
            </Animated.View>
        </TouchableWithoutFeedback>);
    }
}

class Overlay extends Component {
    constructor(props) {
        super(props);

        this.overlayZoom = new Animated.Value(0);
        this.overlayFade = new Animated.Value(1);

        this.state = {
            top: 0,
            left: 0
        };
    }

    init(button) {
        const { onTransition } = this.props;
        const window = Dimensions.get('window');

        UIManager.measure(
            findNodeHandle(button),
            (fx, fy, width, height, px, py) => {
                let _top = top = py + height / 2;
                let _left = left = px + width / 2;

                // bottom left button => NP
                // left button
                if(left < window.width/2) {
                    _left = window.width - left;
                }
                // top button
                if(top < window.height/2) {
                    _top = window.height - top;
                }

                this.setState({
                    top, left,
                    height: Math.sqrt(_top*_top + _left*_left)*2
                }, () =>  this.zoomIn(onTransition));
            }
        );

    }

    zoomIn  = (callback) => this.zoom(0, 1, callback);
    zoomOut = (callback) => this.zoom(1, 0, callback);
    fadeIn  = (callback) => this.fade(0, 1, callback);
    fadeOut = (callback) => this.fade(1, 0, callback);

    zoom = (start, end, callback) => {
        const { height } = this.state;

        this.overlayZoom.setValue(start);
        Animated.timing(
            this.overlayZoom,
            {
                toValue: end,
                duration: height / 5 || 200,
                easing: Easing.Deceleration
            }
        ).start(callback);
    };

    fade = (start, end, callback) => {
        this.overlayFade.setValue(start);
        Animated.timing(
            this.overlayFade,
            {
                toValue: end,
                duration: 200,
                easing: Easing.Standard
            }
        ).start(callback);
    };

    reset = () => {
        this.overlayZoom.setValue(0);
        this.overlayFade.setValue(1);
    };

    render() {
        const { top, left, height } = this.state;
        const { color }  = this.props;
        const inputRange = [0, 1];
        const size       = this.overlayZoom.interpolate({ inputRange, outputRange: [0, height] });
        const middleSize = this.overlayZoom.interpolate({ inputRange, outputRange: [0, (height)/2] });
        const atop       = this.overlayZoom.interpolate({ inputRange, outputRange: [top, top - (height)/2] });
        const aleft      = this.overlayZoom.interpolate({ inputRange, outputRange: [left, left - (height)/2] });
        const _color     = this.overlayFade.interpolate({ inputRange, outputRange: ["transparent", color] });

        return (<Animated.View style={[styles.container,{
            borderRadius: middleSize,
            width: size,
            height: size,
            top: atop,
            left: aleft,
            backgroundColor: _color
          }]} />);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    }
});

export {
    View, Button, Overlay
}
