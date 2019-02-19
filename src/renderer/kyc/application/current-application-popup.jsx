import React from 'react';
import { withStyles } from '@material-ui/core';
import { Popup } from '../../common/popup';

const styles = theme => ({
	root: {}
});

export const CurrentApplicationPopup = withStyles(styles)(
	({ currentApplication, classes, onClose, open = true }) => {
		return (
			<Popup open={open} closeAction={onClose}>
				<div className={classes.root}>
					Current application {currentApplication.relyingPartyName}
				</div>
			</Popup>
		);
	}
);

export default CurrentApplicationPopup;
