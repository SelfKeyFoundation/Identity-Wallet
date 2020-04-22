import React from 'react';
import { Grid, Typography, Button, LinearProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Popup } from '../common';
import { DownloadIcon2 } from 'selfkey-ui';

const styles = theme => ({
	downloadIcon: {
		width: '66px',
		height: '71px'
	},
	actions: {
		'&>button': {
			marginRight: '20px',
			marginTop: '30px'
		}
	},
	progress: {
		width: '100%'
	}
});

export const AutoUpdateProgress = withStyles(styles)(
	({ classes, progress, closeAction, installRelaunchAction, downloaded }) => {
		return (
			<Popup closeAction={closeAction} open text="Software Update">
				<Grid container direction="row" justify="flex-start" alignItems="flex-start">
					<Grid item xs={2}>
						<DownloadIcon2 className={classes.downloadIcon} />
					</Grid>
					<Grid item xs={10}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
						>
							<Grid item>
								<Typography variant="h1" gutterBottom>
									Downloading...
								</Typography>
							</Grid>
							<Grid item>
								<LinearProgress
									className={classes.progress}
									variant="determinate"
									value={progress.percent}
								/>
							</Grid>
							<Grid item>
								<div className={classes.actions}>
									<Button
										variant="contained"
										size="large"
										onClick={installRelaunchAction}
										disabled={!downloaded}
									>
										INSTALL & RELAUNCH
									</Button>
									<Button variant="outlined" size="large" onClick={closeAction}>
										CANCEL
									</Button>
								</div>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
);

export default AutoUpdateProgress;
