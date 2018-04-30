import React, { Component } from 'react';

export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        width: '175px',
        height: 'auto',
        backgroundColor: '#fff',
        pinWidth: 25,
        fontSize: '12px'
      }
    };
  }

  render() {
    const width = this.props.style.width || this.state.style.width;
    const height = this.props.style.height || this.state.style.height;
    const backgroundColor =
      this.props.style.backgroundColor || this.state.style.backgroundColor;

    return this.props.show ? (
      <div
        onClick={e => e.stopPropagation()}
        style={{
          cursor: 'default',
          fontSize: '1em',
          backgroundColor: backgroundColor,
          width: width,
          height: height,
          overflow: 'hidden',
          transform: 'translate(-50%, -100%)',
          position: 'absolute',
          marginTop: '-20px',
          zIndex: 5
        }}
        ref={el => (this.infoDiv = el)}
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
    pinWidth: 25,
    fontSize: '12px'
  }
};
