import React from 'react';
import { Button, withStyles, Typography } from '@material-ui/core';
import { Popup } from './common';
import { error } from 'selfkey-ui';

const styles = () => ({
	center: {
		textAlign: 'center'
	},
	popup: {
		'& p': {
			color: error
		}
	}
});

export const GlobalError = withStyles(styles)(({ classes, onRefresh }) => (
	<Popup headerClass={classes.popup} open text="Critical Error Occured">
		<Typography variant="body1" align="center">
			Please click on refresh to restart the wallet
		</Typography>
		<br />
		<div className={classes.center}>
			<Button variant="contained" size="large" onClick={onRefresh}>
				Refresh
			</Button>
		</div>
	</Popup>
));
