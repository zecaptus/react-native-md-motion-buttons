import React, { Component } from 'react';
import {
    StyleSheet,
    Animated,
    Easing,
    Text,
    View,
    TouchableWithoutFeedback,
    ActivityIndicator,
    UIManager,
    findNodeHandle,
    Dimensions
} from 'react-native';

class AbtButton extends Component {
    constructor(props) {
        super(props);

        this.buttonWidth = new Animated.Value(0);
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

    load   = (callback) => this.animate(0, 1, callback);
    unload = (callback) => this.animate(1, 0, callback);

    animate = (start, end, callback) => {
        this.buttonWidth.setValue(start);
        Animated.timing(
            this.buttonWidth,
            {
                toValue: end,
                duration: 200,
                easing: Easing.ease
            }
        ).start(callback);
    };

    _onPressButton = () => {
        const { loading, onClick } = this.props;

        if(! loading) onClick(this.button)
    };

    reset = () => {
        this.buttonWidth.setValue(0);
    };

    render() {
        const { style, color, label, loading, height, width } = this.props;

        const anim = this.buttonWidth.interpolate({
            inputRange: [0, 1],
            outputRange: [ width || 300, height || 50]
        });

        let animationStyle = {
            width: anim
        };


        return (<TouchableWithoutFeedback onPress={this._onPressButton}>
            <Animated.View
                style={[style, animationStyle]}
                ref={ref => this.button = ref}>
                {
                    (!loading)?
                        <Text style={{color}}>{label}</Text>:
                        <ActivityIndicator color={color} />
                }
            </Animated.View>
        </TouchableWithoutFeedback>);
    }
}

class AbtOverlay extends Component {
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
                easing: Easing.bezier(0,.76,.77,1.19)
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
                easing: Easing.ease
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

        console.log(height);

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
    AbtButton, AbtOverlay
}
