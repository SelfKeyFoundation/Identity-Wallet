import React from 'react';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
	key: {
		color: '#93B0C1',
		fontSize: '12px',
		display: 'block',
		whiteSpace: 'nowrap',
		margin: '5px auto'
	}
});

export const ProgramPrice = withStyles(styles)(({ classes, price, rate, label }) => {
	if (!price || !rate) {
		return null;
	}

	const numeric = +price;
	const key = numeric / rate;
	const formattedLabel = label ? `${label} ` : '';
	return (
		<div className="price">
			{formattedLabel}
			{numeric.toLocaleString()}
			<span className={classes.key}>{key.toLocaleString()} KEY</span>
		</div>
	);
});

export default ProgramPrice;
