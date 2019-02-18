import React, { Component } from 'react';
import { Grid, FormHelperText, withStyles } from '@material-ui/core';

import { StyledButton, ExchangeLargeIcon, P } from 'selfkey-ui';

const styles = theme => ({
	text: {
		fontSize: '18px',
		lineHeight: '30px'
	},
	footer: {
		marginTop: '30px',
		paddingTop: '30px',
		borderTop: '1px solid #475768'
	},
	contentSection: {
		marginBottom: '20px',
		marginTop: '20px'
	},
	understandLabel: {
		fontFamily: theme.typography.fontFamily,
		fontSize: '14px',
		lineHeight: '21px',
		color: '#93B0C1'
	},
	understandCheckbox: {
		color: '#00C0D9',
		'&$primary$checked': {
			color: '#00C0D9'
		}
	},
	actions: {
		'&>button': {
			marginRight: '20px',
			marginTop: '30px'
		}
	},
	primary: {},
	checked: {}
});

class PaymentConfirmationContentComponent extends Component {
	render() {
		const {
			classes,
			txId,
			name,
			crypoCurrency,
			usdFee,
			ethFee,
			usdNetworkFee,
			ethNetworkFee,
			onConfirm,
			onCancel
		} = this.props;

		return (
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<ExchangeLargeIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="stretch">
						<Grid item classes={{ item: classes.contentSection }}>
							<P className={classes.text}>Payment Confirmation</P>
						</Grid>
						<Grid item classes={{ item: classes.contentSection }}>
							<P className={classes.text}>Transaction ID: {txId}</P>
						</Grid>
						<Grid item classes={{ item: classes.contentSection }}>
							<P className={classes.text}>
								You are about to pay the following amount to {name}.<br />
								The payment will be done with {crypoCurrency} tokens, at the
								provided exchange rate.
							</P>
						</Grid>
						<Grid item classes={{ item: classes.contentSection }}>
							<P className={classes.text}>
								Do not have {crypoCurrency} Tokens yet? Learn how you can get them.
							</P>
						</Grid>
						<Grid item classes={{ item: classes.footer }}>
							<FormHelperText>Cost</FormHelperText>
							<FormHelperText>Total: ${usdFee.toLocaleString()}</FormHelperText>
							<FormHelperText>
								{ethFee.toLocaleString()} {crypoCurrency} {'(icon)'}
							</FormHelperText>
							<FormHelperText>Network Transaction Fee</FormHelperText>
							<FormHelperText>${usdNetworkFee.toLocaleString()}</FormHelperText>
							<FormHelperText>
								{ethNetworkFee.toLocaleString()} {crypoCurrency} {'(icon)'}
							</FormHelperText>
							<div className={classes.actions}>
								<StyledButton variant="contained" size="medium" onClick={onConfirm}>
									Confirm
								</StyledButton>
								<StyledButton variant="outlined" size="medium" onClick={onCancel}>
									Cancel
								</StyledButton>
							</div>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const PaymentConfirmationContent = withStyles(styles)(PaymentConfirmationContentComponent);

export default PaymentConfirmationContent;
