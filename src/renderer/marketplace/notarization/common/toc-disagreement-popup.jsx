import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CloseButtonIcon } from 'selfkey-ui';

const styles = theme => ({
	container: {
		margin: '0 auto',
		maxWidth: '500px',
		position: 'relative',
		width: '100%'
	},
	containerHeader: {
		alignItems: 'flex-start',
		background: '#2A3540',
		display: 'flex',
		justifyContent: 'flex-start',
		padding: '20px 30px',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-20px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		boxShadow: '0 50px 70px -50px black',
		padding: '30px'
	},
	text: {
		marginBottom: '40px'
	},
	buttons: {
		marginBottom: '20px'
	},
	requestBtn: {
		marginRight: '20px'
	}
});

export const TOCDisagreementPopup = withStyles(styles)(props => {
	const { classes, onBackClick, onReturnClick } = props;

	return (
		<div className={classes.container}>
			<CloseButtonIcon onClick={onBackClick} className={classes.closeIcon} />
			<div className={classes.containerHeader}>
				<Typography variant="h2" className="region">
					Need to Accept Terms
				</Typography>
			</div>
			<div className={classes.contentContainer}>
				<div className={classes.text}>
					<Typography variant="body2">
						You will need to accept the Terms of Service in order to access the
						notarization services or you will be unable to proceed. Return to the TOS
						agreement below or cancel the application.
					</Typography>
				</div>
				<div className={classes.buttons}>
					<Button
						className={classes.requestBtn}
						variant="contained"
						size="large"
						onClick={onReturnClick}
					>
						Return to TOS
					</Button>
					<Button variant="outlined" size="large" onClick={onBackClick}>
						Cancel Application
					</Button>
				</div>
			</div>
		</div>
	);
});

export default TOCDisagreementPopup;
