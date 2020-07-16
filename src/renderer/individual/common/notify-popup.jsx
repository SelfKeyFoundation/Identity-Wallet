import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Popup } from '../../common/popup';

const styles = theme => ({});

export const NotifyPopup = withStyles(styles)(({ classes, title, text, onClose }) => (
	<Popup open={true} text={title} closeAction={onClose}>
		<Grid
			container
			className={classes.root}
			spacing={4}
			direction="column"
			justify="flex-start"
			alignItems="stretch"
		>
			<Grid item>
				<Typography variant="overline">{text}</Typography>
			</Grid>
			<Grid item>
				<Grid container spacing={3}>
					<Grid item>
						<Button variant="outlined" size="large" onClick={onClose}>
							Close
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	</Popup>
));
