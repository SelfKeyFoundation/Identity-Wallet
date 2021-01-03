import React from 'react';
import { NumberFormat } from 'selfkey-ui';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	root: {
		color: '#FFFFFF',
		fontSize: '16px',
		fontFamily: 'Lato, arial, sans-serif'
	}
});

const ActualTransactionFeeBoxComponent = props => {
	const { classes, locale, ethFee, fiatCurrency, usdFee } = props;

	return (
		<Grid container className={classes.root} direction="row" spacing={1}>
			<Grid item>
				<Grid container spacing={1}>
					<Grid item>
						<NumberFormat
							locale={locale}
							style="decimal"
							currency="ETH"
							value={ethFee}
							fractionDigits={15}
						/>
					</Grid>
					<Grid item>ETH</Grid>
					<Grid item>/</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Grid container spacing={1}>
					<Grid item>
						<NumberFormat
							locale={locale}
							style="currency"
							currency={fiatCurrency}
							value={usdFee}
							fractionDigits={15}
						/>
					</Grid>
					<Grid item>{fiatCurrency}</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export const ActualTransactionFeeBox = withStyles(styles)(ActualTransactionFeeBoxComponent);

export default ActualTransactionFeeBox;
