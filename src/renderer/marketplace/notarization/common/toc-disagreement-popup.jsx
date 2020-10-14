import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Popup } from '../../../common';

const styles = theme => ({
	contentContainer: {
		borderRadius: '4px'
	},
	text: {
		marginBottom: theme.spacing(5)
	},
	buttons: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	popup: {
		'& > div:nth-child(3)': {
			maxWidth: '500px'
		}
	},
	popupPadding: {
		padding: theme.spacing(4, 4, 7)
	}
});

export const TOCDisagreementPopup = withStyles(styles)(props => {
	const { classes, onBackClick, onReturnClick } = props;

	return (
		<Popup
			className={classes.popup}
			xtraClass={classes.popupPadding}
			closeAction={onBackClick}
			text="Need to Accept Terms"
		>
			<div>
				<div className={classes.contentContainer}>
					<div className={classes.text}>
						<Typography variant="body2">
							You will need to accept the Terms of Service in order to access the
							notarization services or you will be unable to proceed. Return to the
							TOS agreement below or cancel the application.
						</Typography>
					</div>
					<div className={classes.buttons}>
						<Button variant="contained" size="large" onClick={onReturnClick}>
							Return to TOS
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							size="large"
							onClick={onBackClick}
						>
							Cancel Application
						</Button>
					</div>
				</div>
			</div>
		</Popup>
	);
});

export default TOCDisagreementPopup;
