"use strict";

import React from "react";
import {
  View,
  ColorPropType,
  requireNativeComponent,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
const createReactClass = require("create-react-class");

class WheelCurvedPicker extends React.Component {
  static propTypes = {
    ...View.propTypes,

    data: PropTypes.array,

    textColor: ColorPropType,

    textSize: PropTypes.number,

    itemStyle: PropTypes.object,

    itemSpace: PropTypes.number,

    onValueChange: PropTypes.func,

    selectedValue: PropTypes.any,

    selectedIndex: PropTypes.number
  };

  static defaultProps = {
    itemStyle: { color: "black", fontSize: 18 },
    itemSpace: 20,
    data: [""] //android下为空会直接报错,ios没问题，所以必须设置一个空值
  };

  dataIsNumber = false;

  constructor(props) {
    super(props);
    this.state = this._stateFromProps(props);
  }
  
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    if(prevProps !== this.props) {
      this.setState(this._stateFromProps(this.props));
    }
  }

  _stateFromProps = props => {
    var selectedIndex = 0;
    var items = [];
    React.Children.forEach(props.children, (child, index) => {
      if (child.props.value === props.selectedValue) {
        selectedIndex = index;
      }
      //判断数据是否为number
      if (index === 0 && typeof child.props.value === "number") {
        this.dataIsNumber = true;
      }
      items.push({ value: child.props.value+'', label: child.props.label });
    });

    var textSize = props.itemStyle.fontSize;
    var textColor = props.itemStyle.color;

    return { selectedIndex, items, textSize, textColor };
  };

  _onValueChange = (e: Event) => {
    //eslint-disable-line
    if (this.props.onValueChange) {
      let data = e.nativeEvent.data;
      if (this.dataIsNumber) {
        data = parseFloat(data);
      }
      this.props.onValueChange(data);
    }
  };

  render() {
    return (
      <WheelCurvedPickerNative
        {...this.props}
        style={[styles.picker, this.props.style]}
        curtainColor={"#999999"}
        indicator={true}
        indicatorColor={"#e1e1e1"}
        curved={true}
        onValueChange={this._onValueChange}
        data={this.state.items}
        textColor={this.state.textColor || "#333"}
        selectTextColor={"#000"}
        textSize={this.state.textSize}
        selectedIndex={parseInt(this.state.selectedIndex)}
      />
    );
  }
}

WheelCurvedPicker.Item = createReactClass({
  propTypes: {
    value: PropTypes.any, // string or integer basically
    label: PropTypes.string
  },

  render: function() {
    // These items don't get rendered directly.
    return null;
  }
});

const styles = StyleSheet.create({
  picker: {
    // The picker will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: 216
  }
});

var WheelCurvedPickerNative = requireNativeComponent(
  "WheelCurvedPicker",
  WheelCurvedPicker
);

export default WheelCurvedPicker;
