import React, { Component } from 'react'
import { css } from 'emotion'

import { mapState } from '../state'

export default class Pin extends Component {
 render() {
  const { point_count, getZoom, cluster_id, lat, lng } = this.props
  const size =
   point_count > 150 ? `large` : point_count > 75 ? `medium` : `small`
  return (
   <div
    className={`${styles.cluster} ${size}`}
    onClick={() => {
     mapState.setState({ zoom: getZoom(cluster_id), center: { lat, lng } })
    }}
   >
    <div className="pointCount">{point_count}</div>
   </div>
  )
 }
}

const styles = {
 cluster: css`
  cursor: pointer;
  border-radius: 50%;
  &.small {
   background: #ffdbdb;
   border: 2px solid #ff4c4c;
   color: #ff4c4c;
   height: 35px;
   width: 35px;
  }
  &.medium {
   background: #ffedcc;
   border: 2px solid #ffa500;
   color: #ffa500;
   height: 40px;
   width: 40px;
  }
  &.large {
   background: #ccffcc;
   border: 2px solid #00b200;
   color: #00b200;
   height: 45px;
   width: 45px;
  }

  & .pointCount {
   position: relative;
   top: 50%;
   transform: translateY(-50%);
   text-align: center;
   font-weight: 600;
  }
 `
}
