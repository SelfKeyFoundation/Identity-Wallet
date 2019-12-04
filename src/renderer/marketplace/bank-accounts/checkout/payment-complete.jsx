import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { CloseButtonIcon, HourGlassLargeIcon } from 'selfkey-ui';

const styles = theme => ({
	container: {
		position: 'relative',
		width: '100%',
		margin: '0 auto',
		maxWidth: '780px'
	},
	containerHeader: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
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
		boxShadow: '0 50px 70px -50px black',
		padding: '30px'
	},
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

export const BankAccountsPaymentComplete = withStyles(styles)(props => {
	const { classes, email, onBackClick, onContinueClick } = props;
	return (
		<div className={classes.container}>
			<CloseButtonIcon onClick={onBackClick} className={classes.closeIcon} />
			<Grid
				container
				justify="flex-start"
				alignItems="flex-start"
				className={classes.containerHeader}
			>
				<Typography variant="body1">Payment Received</Typography>
			</Grid>
			<div className={classes.contentContainer}>
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
							<Typography variant="body2" gutterBottom>
								Please click the continue button and select your preferred Bank to
								continue the process. If you have any questions in the meantime, you
								can reach us at:
							</Typography>
							<Typography
								variant="body2"
								color="primary"
								gutterBottom
								className="email"
							>
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
			</div>
		</div>
	);
});

export default BankAccountsPaymentComplete;
