import * as React from 'react';
import injectSheet, { StyleSheet } from 'react-jss';

const styles: StyleSheet = {
	stakingBox: {
		padding: '90px 30px 40px 30px',
		position: 'relative',
		borderRadius: '4px',
		backgroundColor: '#262f39',
		border: 'solid 1px #303c49',
		boxShadow: '0 0 16px 1px #15222e'
	}
};

export type StakingBoxProps = {};

export const StakingBox = injectSheet(styles)<StakingBoxProps>(({ classes, children }) => (
	<div className={classes.stakingBox}>{children}</div>
));

export default StakingBox;
