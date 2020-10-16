import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/styles';
import countdownFn from 'countdown';
import { Typography } from '@material-ui/core';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles({
	timePeriodContainer: {
		width: '100%',
		height: 44,
		border: '1px solid #384656',
		background: '#1E262E',
		borderRadius: 5,
		padding: 1,
		position: 'relative'
	},
	progress: {
		position: 'absolute',
		left: 0,
		top: 0,
		backgroundColor: '#697C95',
		borderRadius: 5,
		zIndex: 1,
		height: '100%'
	},
	countdown: {
		position: 'absolute',
		zIndex: 2,
		right: 20,
		top: 12
	}
});

const toCountdown = (startTs, endTs) => countdownFn(startTs, endTs, countdownFn.DEFAULTS, 2);

export const TimelockPeriod = ({ startTs, endTs, hasStaked }) => {
	startTs = new Date(startTs);
	endTs = new Date(endTs);
	const classes = useStyles();
	let complete = false;
	const [countdown, setCountDown] = useState(toCountdown(null, endTs));

	const percentPassed = Math.min(
		100,
		Math.round(((Date.now() - startTs.getTime()) / (endTs.getTime() - startTs.getTime())) * 100)
	);

	useEffect(
		() => {
			const interval = setInterval(() => {
				setCountDown(toCountdown(null, endTs));
			}, 1000);
			return () => clearInterval(interval);
		},
		[countdown]
	);

	if (hasStaked && Date.now() > endTs.getTime()) {
		complete = true;
	}

	const countDownInProgress = !complete && hasStaked;

	return (
		<div className={classes.timePeriodContainer}>
			{(countDownInProgress || complete) && (
				<div className={classes.progress} style={{ width: `${percentPassed}%` }} />
			)}
			{countDownInProgress && (
				<Typography variant="subtitle1" color="secondary" className={classes.countdown}>
					{countdown.toString()}
				</Typography>
			)}
			{complete && (
				<Typography variant="subtitle1" color="primary" className={classes.countdown}>
					Timelock complete!
				</Typography>
			)}
			{!hasStaked && (
				<Typography variant="subtitle1" color="secondary" className={classes.countdown}>
					No timelock yet
				</Typography>
			)}
		</div>
	);
};

TimelockPeriod.propTypes = {
	startTs: PropTypes.date,
	endTs: PropTypes.date
};

TimelockPeriod.defaultProps = {
	startTs: new Date(0),
	endTs: new Date(0)
};
