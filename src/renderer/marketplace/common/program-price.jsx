import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	key: {
		display: 'block',
		whiteSpace: 'nowrap',
		margin: '0 auto'
	},
	price: {
		fontSize: '15px'
	}
});

export const ProgramPrice = withStyles(styles)(
	({ classes, price, rate, label, extraLabel, keyLabel }) => {
		if ((price !== 0 && !price) || !rate) {
			return null;
		}
		const numeric = +price;
		const key = numeric / rate;
		const formattedLabel = label ? `${label} ` : '';
		const formattedExtraLabel = extraLabel ? ` ${extraLabel}` : '';
		const formattedKeyLabel = keyLabel ? ` ${keyLabel}` : '';
		return (
			<div className={`${classes.price} price`}>
				{formattedLabel}
				{numeric.toLocaleString()}
				{formattedExtraLabel}
				<span className={classes.key}>
					<Typography variant="subtitle2" color="secondary">
						{formattedKeyLabel}
						{key.toLocaleString()} KEY
					</Typography>
				</span>
			</div>
		);
	}
);

export default ProgramPrice;
