import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { HourGlassLargeIcon } from 'selfkey-ui';
import { Popup } from '../../common';

const styles = theme => ({
	container: {
		position: 'relative',
		width: '100%',
		margin: '0 auto',
		maxWidth: '960px'
	},
	containerHeader: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: '1em',
			marginTop: '0.25em',
			marginBottom: '0',
			fontSize: '24px'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-19px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	},
	icon: {
		width: '120px'
	},
	iconWrap: {
		paddingLeft: '10px'
	},
	content: {
		width: 'calc(100% - 120px)'
	},
	description: {
		fontFamily: 'Lato, arial',
		color: '#FFF',
		lineHeight: '1.5em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1em'
		},
		'& p.email': {
			color: '#00C0D9',
			padding: '10px 0 10px 0'
		},
		'& strong': {
			fontWeight: '700'
		}
	},
	instructions: {
		padding: '30px 0',
		borderTop: '1px solid #475768'
	},
	footer: {
		width: '100%',
		'& button': {
			marginRight: '30px'
		}
	}
});

export const MarketplacePaymentComplete = withStyles(styles)(props => {
	const { classes, email, onBackClick, onContinueClick } = props;
	return (
		<Popup closeAction={onBackClick} open text="Payment Received">
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2} className={classes.iconWrap}>
					<HourGlassLargeIcon />
				</Grid>
				<div className={classes.content}>
					<div className={classes.description}>
						<Typography variant="h1" gutterBottom>
							Payment Complete!
						</Typography>
						<Typography variant="body2" gutterBottom>
							Please click the continue button to continue the process. If you have
							any questions in the meantime, you can reach us at:
						</Typography>
						<Typography variant="body2" color="primary" gutterBottom className="email">
							{email}
						</Typography>
					</div>
					<div className={classes.footer}>
						<Button variant="contained" size="large" onClick={onContinueClick}>
							Continue
						</Button>
					</div>
				</div>
			</Grid>
		</Popup>
	);
});

export default MarketplacePaymentComplete;
