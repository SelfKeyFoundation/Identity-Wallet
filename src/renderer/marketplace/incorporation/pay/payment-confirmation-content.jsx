import React, { Component } from 'react';
import { Grid, withStyles, Typography, Button, IconButton } from '@material-ui/core';

import { KeyTooltip, TooltipArrow, PaymentIcon, InfoTooltip } from 'selfkey-ui';

const styles = theme => ({
	footer: {
		marginTop: '30px',
		paddingTop: '30px',
		borderTop: '1px solid #475768'
	},
	actions: {
		'&>button': {
			marginRight: '20px',
			marginTop: '30px'
		}
	},
	bold: {
		fontWeight: 600
	},
	textRight: {
		textAlign: 'right'
	},
	bottomSpace: {
		marginBottom: '30px'
	},
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	}
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
			tooltipFee,
			usdNetworkFee,
			ethNetworkFee,
			tooltipNetworkFee,
			learnHowURL,
			onConfirm,
			onCancel
		} = this.props;

		return (
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<PaymentIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="stretch">
						<Grid item>
							<Typography variant="h1" gutterBottom>
								Payment Confirmation
							</Typography>
						</Grid>
						<Grid item className={classes.bottomSpace} style={{ display: 'none' }}>
							<Typography variant="subtitle2" color="secondary" gutterBottom>
								Transaction ID: {txId}
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1" gutterBottom>
								You are about to pay the following amount to {name}.<br />
								The payment will be done with {crypoCurrency} tokens, at the
								provided exchange rate.
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="subtitle2" color="secondary" gutterBottom>
								Do not have {crypoCurrency} Tokens yet?{' '}
								<a
									className={classes.link}
									onClick={e => {
										window.openExternal(e, learnHowURL);
									}}
								>
									Learn how
								</a>{' '}
								you can get them.
							</Typography>
						</Grid>
						<Grid item classes={{ item: classes.footer }}>
							<Grid container justify="space-between" className={classes.bottomSpace}>
								<Grid item>
									<Typography variant="h2">Cost</Typography>
								</Grid>
								<Grid item className={classes.textRight}>
									<Typography
										variant="body2"
										color="primary"
										className={classes.bold}
									>
										Total: ${usdFee.toLocaleString()}
									</Typography>
									<Typography variant="subtitle2" color="secondary" gutterBottom>
										{ethFee.toLocaleString()} {crypoCurrency}
										<KeyTooltip
											interactive
											placement="top-start"
											title={
												<React.Fragment>
													<span>{tooltipFee}</span>
													<TooltipArrow />
												</React.Fragment>
											}
										>
											<IconButton aria-label="Info">
												<InfoTooltip />
											</IconButton>
										</KeyTooltip>
									</Typography>
								</Grid>
							</Grid>
							<Grid container justify="space-between">
								<Grid item>
									<Typography variant="h3" color="secondary">
										Network Transaction Fee
									</Typography>
								</Grid>
								<Grid item className={classes.textRight}>
									<Typography
										variant="body2"
										color="primary"
										className={classes.bold}
									>
										${usdNetworkFee.toLocaleString()}
									</Typography>
									<Typography variant="subtitle2" color="secondary" gutterBottom>
										{ethNetworkFee.toLocaleString()} ETH
										<KeyTooltip
											interactive
											placement="top-start"
											title={
												<React.Fragment>
													<span>{tooltipNetworkFee}</span>
													<TooltipArrow />
												</React.Fragment>
											}
										>
											<IconButton aria-label="Info">
												<InfoTooltip />
											</IconButton>
										</KeyTooltip>
									</Typography>
								</Grid>
							</Grid>
							<div className={classes.actions}>
								<Button variant="contained" size="large" onClick={onConfirm}>
									Confirm
								</Button>
								<Button variant="outlined" size="large" onClick={onCancel}>
									Cancel
								</Button>
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
