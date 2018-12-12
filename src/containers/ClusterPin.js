import React, { Component } from 'react'
import { css, cx } from 'emotion'

export default class ClusterPin extends Component {
	render() {
		const { point_count, getZoom, cluster_id, lat, lng, updateMap } = this.props
		const size =
			point_count > 50 ? `large` : point_count > 25 ? `medium` : `small`
		return (
			<div
				className={cx(styles.cluster, styles[`${size}`])}
				onClick={() => {
					updateMap({ zoom: getZoom(cluster_id), center: { lat, lng } })
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
		& .pointCount {
			position: relative;
			top: 50%;
			transform: translateY(-50%);
			text-align: center;
			font-weight: 600;
		}
	`,
	small: css`
		background: #ffdbdb;
		border: 2px solid #ff4c4c;
		color: #ff4c4c;
		height: 35px;
		width: 35px;
	`,
	medium: css`
		background: #ffedcc;
		border: 2px solid #ffa500;
		color: #ffa500;
		height: 40px;
		width: 40px;
	`,
	large: css`
		background: #ccffcc;
		border: 2px solid #00b200;
		color: #00b200;
		height: 45px;
		width: 45px;
	`
}
