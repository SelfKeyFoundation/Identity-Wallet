import React from 'react';
import { Typography, Button, withStyles, Divider, Input } from '@material-ui/core';
import { PaymentIcon, Copy, baseDark, grey } from 'selfkey-ui';
import { Popup } from '../../common';

const styles = theme => ({
	popup: {
		'& p:fild-child': {
			paddingLeft: '15px'
		}
	},
	container: {
		alignItems: 'flex-start',
		display: 'flex',
		justifyContent: 'flex-start',
		paddingRight: '10px'
	},
	content: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	icon: {
		marginRight: '30px'
	},
	title: {
		marginBottom: '20px'
	},
	payButton: {
		marginRight: '20px'
	},
	input: {
		marginBottom: '5px',
		width: '100%'
	},
	divider: {
		height: '2px',
		margin: '30px 0 25px'
	},
	did: {
		marginRight: '5px'
	},
	usdWrap: {
		textAlign: 'right'
	},
	usd: {
		marginTop: '-36px',
		position: 'absolute',
		right: '60px'
	},
	key: {
		marginRight: '1px'
	},
	footer: {
		'& textarea': {
			backgroundColor: baseDark,
			boxSizing: 'border-box',
			border: '1px solid #384656',
			borderRadius: '4px',
			color: '#fff',
			fontFamily: 'Lato,arial,sans-serif',
			fontSize: '14px',
			lineHeight: '21px',
			outline: 'none',
			padding: '10px 15px',
			width: '100%',
			'&::placeholder': {
				color: grey
			}
		}
	},
	marginBottom: {
		marginBottom: '20px'
	},
	actions: {
		marginTop: '34px'
	}
});

export const RequirePayment = withStyles(styles)(props => {
	const { classes, name, address } = props;

	return (
		<Popup className={classes.popup} closeAction={''} open text="Notarization Payment ">
			<div className={classes.container}>
				<div className={classes.icon}>
					<PaymentIcon className={classes.paymentIcon} />
				</div>
				<div>
					<div className={classes.content}>
						<div className={classes.title}>
							<Typography variant="h1">
								Require payment for the notary services
							</Typography>
						</div>
						<div>
							<Typography variant="body1">
								You are about to initiate a payment requirement to {name}. The
								payment will be done with KEY tokens, at the provided exchange rate.
							</Typography>
						</div>
						<div>
							<Divider className={classes.divider} />
						</div>
						<div className={classes.marginBottom}>
							<Typography variant="body2">Payment Address:</Typography>
							<div style={{ display: 'flex' }}>
								<div>
									<Typography
										className={classes.did}
										variant="subtitle1"
										color="secondary"
									>
										{address}
									</Typography>
								</div>
								<div>
									<Copy text="0x4ac0d9ebd28118cab68a64ad8eb8c07c0120ebf8" />
								</div>
							</div>
						</div>

						<div className={classes.marginBottom}>
							<Typography variant="overline" gutterBottom>
								Amount
							</Typography>
							<Input
								className={`${classes.input}`}
								type="number"
								placeholder="$ 0.00"
							/>
							<div className={classes.usdWrap}>
								<Typography
									variant="subtitle2"
									color="secondary"
									align="right"
									className={classes.usd}
								>
									USD
								</Typography>
							</div>
							<Typography
								variant="subtitle2"
								color="secondary"
								align="right"
								className={classes.key}
							>
								0.00 KEY
							</Typography>
						</div>

						<div className={classes.footer}>
							<Typography variant="overline" gutterBottom>
								Message for user*
							</Typography>
							<textarea
								rows="5"
								placeholder="Please describe the extra payment represents"
							/>
						</div>

						<div className={classes.actions}>
							<div>
								<Button
									className={classes.payButton}
									variant="contained"
									size="large"
									onClick={''}
								>
									Send Payment Request
								</Button>
								<Button variant="outlined" size="large" onClick={''}>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Popup>
	);
});

export default RequirePayment;
