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
		color: '#FFF',
		fontFamily: 'Lato, arial',
		fontSize: '14px',
		lineHeight: '1.5em',
		'& p': {
			marginBottom: theme.spacing(2)
		},
		'& p.email': {
			color: '#00C0D9',
			padding: theme.spacing(1, 0)
		},
		'& strong': {
			fontWeight: '700'
		}
	},
	footer: {
		width: '100%',
		'& button': {
			marginRight: theme.spacing(4)
		}
	}
});

export const BankAccountsPaymentComplete = withStyles(styles)(props => {
	const { classes, email, identity, onBackClick, onContinueClick } = props;
	const simpleFlow = identity.type === 'corporate';
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
							Bank Account KYC Process Started
						</Typography>
						<Typography variant="body1" gutterBottom>
							Thank you for payment!
						</Typography>
						{simpleFlow && (
							<Typography variant="body2" gutterBottom>
								One of our managers is reviewing the information you submitted and{' '}
								<strong>
									will contact you shortly on the e-mail you provided{' '}
								</strong>
								, to continue the process. If you have any questions in the
								meantime, you can reach us at:
							</Typography>
						)}

						{!simpleFlow && (
							<Typography variant="body2" gutterBottom>
								Please click the continue button and select your preferred Bank to
								continue the process. If you have any questions in the meantime, you
								can reach us at:
							</Typography>
						)}
						<Typography variant="body2" color="primary" gutterBottom className="email">
							{email}
						</Typography>
					</div>
					{!simpleFlow && (
						<div className={classes.footer}>
							<Button variant="contained" size="large" onClick={onContinueClick}>
								Continue
							</Button>
						</div>
					)}
				</div>
			</Grid>
		</Popup>
	);
});

export default BankAccountsPaymentComplete;
