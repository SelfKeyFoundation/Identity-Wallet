import React from 'react';
import { Button, withStyles, Typography, Grid } from '@material-ui/core';
import { ModalWrap, ModalHeader, ModalBody } from 'selfkey-ui';

const styles = theme => ({
	modalPosition: {
		position: 'static',
		marginTop: '300px',
		textAlign: 'center'
	}
});
export const GlobalError = withStyles(styles)(({ classes, onRefresh }) => (
	<ModalWrap className={classes.modalPosition}>
		<ModalHeader>
			<Grid container direction="row" justify="space-between" alignItems="center">
				<Grid item>
					<Typography variant="body1" color="error">
						Critical Error Occured
					</Typography>
				</Grid>
			</Grid>
		</ModalHeader>
		<ModalBody>
			<Typography variant="body1">Please click on refresh to restart the wallet</Typography>
			<br />
			<Button variant="contained" size="large" onClick={onRefresh}>
				Refresh
			</Button>
		</ModalBody>
	</ModalWrap>
));
