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
    const pinWidth = this.props.style.pinWidth || this.state.style.pinWidth;
    let fontSize = this.props.style.fontSize || this.state.style.fontSize;
    let right = 0;

    if (fontSize.indexOf('rem') !== -1) {
      const remfontSize = fontSize.slice(0, fontSize.indexOf('r'));
      fontSize =
        remfontSize *
        this.state.style.fontSize.slice(
          0,
          this.state.style.fontSize.indexOf('p')
        );
    } else if (fontSize.indexOf('em') !== -1) {
      const emfontSize = fontSize.slice(0, fontSize.indexOf('e'));
      fontSize =
        emfontSize *
        this.state.style.fontSize.slice(
          0,
          this.state.style.fontSize.indexOf('p')
        );
    } else if (fontSize.indexOf('p') !== -1) {
      fontSize = fontSize.slice(0, fontSize.indexOf('p'));
    }

    if (width.indexOf('p') !== -1) {
      const nopxWidth = width.slice(0, width.indexOf('p'));
      right = (nopxWidth - pinWidth) / 2;
    } else if (width.indexOf('rem') !== -1) {
      const remWidth = width.slice(0, width.indexOf('r'));
      right = (remWidth * fontSize - pinWidth) / 2;
    } else if (width.indexOf('em') !== -1) {
      const emWidth = width.slice(0, width.indexOf('e'));
      right = (emWidth * fontSize - pinWidth) / 2;
    }

    return this.props.show ? (
      <div
        onClick={e => e.stopPropagation()}
        style={{
          cursor: 'default',
          fontSize: '1em',
          backgroundColor: backgroundColor,
          width: width,
          height: height,
          fontSize: `${fontSize}px`,
          overflow: 'hidden',
          transform: 'translateY(-100%)',
          position: 'relative',
          bottom: '10px',
          right: `${right}px`,
          zIndex: 10000
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
