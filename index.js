import React, { Component } from 'react';
import { Animated, PanResponder } from 'react-native';

const YES = (evt, gestureState) => true;
const NO = (evt, gestureState) => false;

export default class Draggable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draggable: new Animated.ValueXY(),
      dragging: false
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: YES,
      onStartShouldSetPanResponderCapture: YES,
      onMoveShouldSetPanResponder: YES,
      onMoveShouldSetPanResponderCapture: YES,
      onPanResponderTerminationRequest: YES,
      onShouldBlockNativeResponder: YES,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.draggable.extractOffset();
        if (this.props.dragStarted) {
          this.props.dragStarted();
        }
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: this.state.draggable.x, dy: this.state.draggable.y }
      ]),
      onPanResponderRelease: (evt, gestureState) => {
        if (this.props.dragEnded) {
          this.props.dragEnded(true);
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        if (this.props.dragEnded) {
          this.props.dragEnded(false);
        }
      }
    });
  }

  render() {
    const animated = {
      transform: []
    };

    if (!this.props.xLocked) {
      animated.transform.push({ translateX: this.state.draggable.x });
    }

    if (!this.props.yLocked) {
      animated.transform.push({ translateY: this.state.draggable.y });
    }

    return (
      <Animated.View style={[this.props.style, animated]} {...this.panResponder.panHandlers}>
        {this.props.children}
      </Animated.View>
    );
  }
}
