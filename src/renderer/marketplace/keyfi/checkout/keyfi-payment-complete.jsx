import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { HourGlassLargeIcon } from 'selfkey-ui';
import { Popup } from '../../../common';

const styles = theme => ({
	icon: {
		width: '120px'
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
	footer: {
		width: '100%',
		'& button': {
			marginRight: '30px'
		}
	}
});

export const KeyFiPaymentComplete = withStyles(styles)(props => {
	const { classes, email, onBackClick, onContinueClick } = props;
	return (
		<Popup closeAction={onBackClick} open text="Payment Received">
			<Grid
				container
				justify="flex-start"
				alignItems="flex-start"
				className={classes.content}
			>
				<div className={classes.icon}>
					<HourGlassLargeIcon />
				</div>
				<div className={classes.content}>
					<div className={classes.description}>
						<Typography variant="h1" gutterBottom>
							KeyFi.com KYC Process Started
						</Typography>
						<Typography variant="body1" gutterBottom>
							Thank you!
						</Typography>
						<Typography variant="body2" gutterBottom>
							One of our managers is reviewing the information you submitted and{' '}
							<strong>will contact you shortly on the e-mail you provided </strong>.
							If you have any questions in the meantime, you can reach us at:
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

export default KeyFiPaymentComplete;
