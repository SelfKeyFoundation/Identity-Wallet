import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	key: {
		display: 'block',
		whiteSpace: 'nowrap',
		margin: '5px auto 0'
	}
});

export const ProgramPrice = withStyles(styles)(({ classes, price, rate, label, extraLabel }) => {
	if (!price || !rate) {
		return null;
	}

	const numeric = +price;
	const key = numeric / rate;
	const formattedLabel = label ? `${label} ` : '';
	const formattedExtraLabel = extraLabel ? ` ${extraLabel}` : '';
	return (
		<div className="price">
			{formattedLabel}
			{numeric.toLocaleString()}
			{formattedExtraLabel}
			<span className={classes.key}>
				<Typography variant="subtitle2" color="secondary">
					{key.toLocaleString()} KEY
				</Typography>
			</span>
		</div>
	);
});

export default ProgramPrice;
