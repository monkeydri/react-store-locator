import React, { Component } from 'react';

export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        width: '175px',
        height: 'auto',
        backgroundColor: '#fff',
        pinWidth: 25
      }
    };
  }

  render() {
    const width = this.props.style.width || this.state.style.width;
    const height = this.props.style.height || this.state.style.height;
    const backgroundColor =
      this.props.style.backgroundColor || this.state.style.backgroundColor;
    const pinWidth = this.props.style.pinWidth || this.state.style.pinWidth;
    const nopxWidth = width.slice(0, width.indexOf('p'));
    const right = (nopxWidth - pinWidth) / 2;

    return this.props.show ? (
      <div
        onClick={e => e.stopPropagation()}
        style={{
          cursor: 'default',
          backgroundColor: backgroundColor,
          width: width,
          height: height,
          overflow: 'hidden',
          transform: 'translateY(-100%)',
          position: 'relative',
          bottom: '10px',
          right: `${right}px`
        }}
      >
        {this.props.children}
      </div>
    ) : null;
  }
}

Info.defaultProps = {
  style: {
    width: '175px',
    height: 'auto',
    backgroundColor: '#fff',
    pinWidth: 25
  }
};
