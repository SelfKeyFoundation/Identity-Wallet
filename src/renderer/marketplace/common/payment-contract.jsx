import React from 'react';

import { withStyles, Grid, Typography, Button, IconButton } from '@material-ui/core';
import { Popup } from '../../common';
import { PaymentIcon, KeyTooltip, InfoTooltip } from 'selfkey-ui';

const styles = theme => ({
	paymentIcon: {
		width: '66px',
		height: '71px'
	},
	iconWrap: {
		paddingLeft: '10px'
	},
	wrap: {
		paddingRight: '40px'
	},
	actions: {
		'&>button': {
			marginRight: '20px',
			marginTop: '30px'
		}
	},
	footer: {
		marginTop: '30px',
		paddingTop: '30px',
		borderTop: '1px solid #475768'
	},
	bottomSpace: {
		marginBottom: '20px'
	},
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	},
	tooltip: {
		position: 'relative',
		top: '-2px'
	},
	feeAlignment: {
		display: 'flex',
		flexDirection: 'column',
		textAlign: 'right'
	},
	bold: {
		fontWeight: 600
	}
});

export const PaymentContract = withStyles(styles)(
	({ classes, onBackClick, onPayClick, price, whyLink }) => {
		return (
			<Popup closeAction={onBackClick} open text="Register Payment on the Selfkey Network">
				<Grid container direction="row" justify="flex-start" alignItems="flex-start">
					<Grid item xs={2} className={classes.iconWrap}>
						<PaymentIcon className={classes.paymentIcon} />
					</Grid>
					<Grid item xs={10} className={classes.wrap}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
						>
							<Grid item>
								<Typography variant="h1" className={classes.bottomSpace}>
									Payment Pre-approval
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="body1" className={classes.bottomSpace}>
									Paying for a service in the marketplace requires first a payment
									pre-approval (
									<a
										className={classes.link}
										onClick={e => {
											window.openExternal(e, whyLink);
										}}
									>
										why?
									</a>
									).
								</Typography>
							</Grid>
							<Grid item className={classes.bottomSpace}>
								<Typography
									variant="body1"
									color="secondary"
									className={classes.bottomSpace}
								>
									You only pre-approve the payment you will make in the next step.
									You are not paying at this point, and are in control of your
									funds. This pre-approval allows the vendor to safely receive
									your funds properly through a smart contract on the blockchain.
								</Typography>
							</Grid>
							<Grid container justify="space-between">
								<Grid item>
									<Typography variant="body2" color="secondary" gutterBottom>
										Network Transaction Fee
									</Typography>
								</Grid>
								<Grid item className={classes.feeAlignment}>
									<Typography
										variant="body2"
										color="primary"
										className={classes.bold}
									>
										Price: $ {price}
									</Typography>
									<Typography variant="subtitle2" color="secondary">
										1.9898 KEY
										<KeyTooltip
											interactive
											placement="top-start"
											className={classes.tooltip}
											title={
												<React.Fragment>
													<span>
														Every ERC-20 token has its own smart
														contract address. To learn more,{' '}
														<a
															className={classes.link}
															onClick={e => {
																window.openExternal(
																	e,
																	'https://help.selfkey.org/'
																);
															}}
														>
															click here.
														</a>
													</span>
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
							<Grid item classes={{ item: classes.footer }}>
								<div className={classes.actions}>
									<Button variant="contained" size="large" onClick={onPayClick}>
										Pre-Approve Payment
									</Button>
									<Button variant="outlined" size="large" onClick={onBackClick}>
										Cancel
									</Button>
								</div>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
);

export default PaymentContract;
