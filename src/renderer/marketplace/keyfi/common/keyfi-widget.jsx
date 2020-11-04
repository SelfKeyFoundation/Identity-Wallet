import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button /*, IconButton */ } from '@material-ui/core';
import { PaymentIcon } from 'selfkey-ui';
// import { featureIsEnabled } from 'common/feature-flags';

const styles = theme => ({
	container: {
		backgroundColor: '#262F39',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		flexGrow: 1,
		marginBottom: '15px',
		overflow: 'hidden',
		padding: '20px 30px 30px'
	},
	title: {
		marginBottom: '24px'
	},
	paymentIcon: {
		width: '66px',
		height: '71px',
		display: 'block',
		margin: 'auto'
	},
	iconWrap: {
		paddingLeft: '10px'
	},
	wrap: {
		paddingRight: '40px',
		'& ul': {
			color: theme.palette.secondary.main,
			margin: 0
		}
	},
	actions: {
		textAlign: 'center',
		marginTop: '24px'
	},
	ctabutton: {
		backgroundColor: '#1E262E',
		display: 'flex',
		justifyContent: 'space-between',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: '1em',
		position: 'relative',
		width: '100%',
		maxWidth: '260px',
		zIndex: 1,
		'& span': {
			flexGrow: 1
		},
		'& svg': {
			width: '24px !important',
			height: '24px !important',
			fill: 'white !important'
		}
	}
});

export const KeyFiWidget = withStyles(styles)(({ classes, onCredentialsClick }) => {
	return (
		<Grid
			container
			direction="row"
			justify="flex-start"
			alignItems="center"
			className={classes.container}
		>
			<Grid item xs={8} className={classes.wrap}>
				<Typography variant="h1" className={classes.title}>
					Get your Credentials to start using the new KeyFi platform!
				</Typography>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="stretch"
					spacing={2}
				>
					<Grid item xs={6}>
						<ul>
							<li>
								<Typography variant="h6" color="secondary" gutterBottom>
									LOCK airdrop - Basic Information about yourself. This can be
									edited at any time, but not deleted.{' '}
								</Typography>
							</li>
							<li>
								<Typography variant="h6" color="secondary" gutterBottom>
									STAKING - Any information you provide is stored locally and
									encrypted on-chain. SelfKey is a non custodiary wallet and it
									doesn’t store your documets anywhere.
								</Typography>
							</li>
						</ul>
					</Grid>
					<Grid item xs={6}>
						<ul>
							<li>
								<Typography variant="h6" color="secondary" gutterBottom>
									LOCK airdrop - Basic Information about yourself. This can be
									edited at any time, but not deleted.{' '}
								</Typography>
							</li>
							<li>
								<Typography variant="h6" color="secondary" gutterBottom>
									STAKING - Any information you provide is stored locally and
									encrypted on-chain. SelfKey is a non custodiary wallet and it
									doesn’t store your documets anywhere.
								</Typography>
							</li>
						</ul>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={4} className={classes.iconWrap} justify="center" alignItems="center">
				<PaymentIcon className={classes.paymentIcon} />
				<div className={classes.actions}>
					<Button
						variant="contained"
						size="large"
						onClick={onCredentialsClick}
						className={classes.ctabutton}
					>
						<PaymentIcon width="24px" height="24px" />
						<span>Get Credentials</span>
					</Button>
				</div>
			</Grid>
		</Grid>
	);
});

export default KeyFiWidget;
