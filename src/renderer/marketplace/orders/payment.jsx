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
		paddingTop: '30px !important',
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

export const MarketplacePayment = withStyles(styles)(
	({
		classes,
		onBackClick,
		onPayClick,
		priceUSD,
		priceKey,
		feeETH,
		feeUSD,
		did,
		vendorName,
		onLearnHowClick
	}) => {
		return (
			<Popup closeAction={onBackClick} open text="Bank Account Opening Payment">
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
							spacing={16}
						>
							<Grid item>
								<Typography variant="h1" className={classes.bottomSpace}>
									Payment Required
								</Typography>
								<Typography variant="subtitle" color="secondary">
									{did}
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="body1" className={classes.bottomSpace}>
									Thank you for providing the basic information about yourself!
									<br />
									<br />
									You are about to initiate a payment to {vendorName}. The payment
									will be done with KEY tokens, at the provided exchange rate.
								</Typography>
								{onLearnHowClick && (
									<Typography variant="subtitle" color="secondary">
										Don’t have KEY Tokens yet?{' '}
										<a className={classes.link} onClick={onLearnHowClick}>
											Learn how
										</a>{' '}
										you can get them.
									</Typography>
								)}
							</Grid>

							<Grid item classes={{ item: classes.footer }}>
								<Grid container justify="space-between">
									<Grid item>
										<Typography variant="body2" gutterBottom>
											Cost
										</Typography>
									</Grid>
									<Grid item className={classes.feeAlignment}>
										<Typography
											variant="body2"
											color="primary"
											className={classes.bold}
										>
											Total: $ {priceUSD}
										</Typography>
										<Typography variant="subtitle2" color="secondary">
											{priceKey} KEY
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
							</Grid>
							<Grid item>
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
											$ {feeUSD}
										</Typography>
										<Typography variant="subtitle2" color="secondary">
											{feeETH} ETH
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							<Grid item>
								<div className={classes.actions}>
									<Button variant="contained" size="large" onClick={onPayClick}>
										Pay
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

export default MarketplacePayment;
