import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { DefiIcon } from 'selfkey-ui';

const styles = theme => ({
	container: {
		backgroundColor: '#131F2A',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		flexGrow: 1,
		marginBottom: '15px',
		overflow: 'hidden',
		padding: '30px 30px 30px'
	},
	title: {
		marginBottom: '24px'
	},
	paymentIcon: {
		width: '64px !important',
		height: 'auto !important',
		display: 'block',
		margin: 'auto',
		fill: '#697C95 !important',
		'& g': {
			fill: '#697C95 !important'
		}
	},
	iconWrap: {
		paddingLeft: '10px',
		'& > div': {
			maxWidth: '260px',
			marginRight: '0',
			marginLeft: 'auto'
		}
	},
	wrap: {
		paddingRight: '40px',
		'& ul': {
			color: theme.palette.secondary.main,
			margin: 0
		},
		'& li': {
			listStyle: 'outside',
			marginLeft: '1em'
		}
	},
	actions: {
		textAlign: 'center',
		marginTop: '24px',
		'& span': {
			marginLeft: '10px'
		}
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
		},
		'& svg g': {
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
					Get your Credentials Verified to use KeyFi.com
				</Typography>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="stretch"
					spacing={2}
				>
					<Grid item xs={12}>
						<Typography variant="h6" color="secondary" gutterBottom>
							KeyFi.com is a first of its kind DeFi aggregator platform that lets you
							manage the top DeFi protocols. Get your Credentials verified to access
							KeyFi.com and be a part of a new and innovative AI-powered DeFI
							protocol. By getting your Credentials verified, you{`'`}ll also get to
							claim a limited-period KEY airdrop.
						</Typography>
					</Grid>
					<Grid item xs={6} style={{ display: 'none' }}>
						<ul>
							<li>
								<Typography variant="h6" color="secondary" gutterBottom>
									KeyFi.com is the first of its kind DeFi aggregator platform that
									lets you manage all the top DeFi platforms with ease.
								</Typography>
							</li>
							<li>
								<Typography variant="h6" color="secondary" gutterBottom>
									Get your Credentials verified now to access and earn rewards
									using KeyFi.com.
								</Typography>
							</li>
						</ul>
					</Grid>
					<Grid item xs={6} style={{ display: 'none' }}>
						<ul>
							<li>
								<Typography variant="h6" color="secondary" gutterBottom>
									This AI-powered DeFi platform aims to prepare the DeFi ecosystem
									for regulatory compliance with the first of its kind
									decentralized user verification system backed by SelfKey
									Credentials.
								</Typography>
							</li>
							<li>
								<Typography variant="h6" color="secondary" gutterBottom>
									Also, claim a limited period KEY airdrop for getting your
									Credentials verified.
								</Typography>
							</li>
						</ul>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={4} className={classes.iconWrap}>
				<Grid container justify="center" alignItems="center">
					<DefiIcon className={classes.paymentIcon} />
					<div className={classes.actions}>
						<Button
							variant="contained"
							size="large"
							onClick={onCredentialsClick}
							className={classes.ctabutton}
						>
							<DefiIcon width="24px" height="24px" />
							<span>Get Credentials</span>
						</Button>
					</div>
				</Grid>
			</Grid>
		</Grid>
	);
});

export default KeyFiWidget;
