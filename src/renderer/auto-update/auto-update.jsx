import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
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
	footer: {
		marginTop: '30px',
		paddingTop: '30px',
		borderTop: '1px solid #475768'
	}
});

export const AutoUpdate = withStyles(styles)(
	({ classes, info, closeAction, downloadInstallAction }) => {
		let releaseNotesRef = React.createRef();
		const root = document.createElement('div');
		const shadow = root.createShadowRoot();
		shadow.innerHTML = info.releaseNotes;

		setTimeout(() => {
			releaseNotesRef.current.appendChild(root);
		}, 100);
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
									A new version of the SelfKey Wallet is available!
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="body1" gutterBottom>
									Selfkey Wallet {info && info.releaseName} is available now for
									download. For security reasons please update to latest version!
								</Typography>
							</Grid>
							<Grid item classes={{ item: classes.footer }}>
								<Typography variant="title" color="secondary" gutterBottom>
									Release Notes:
								</Typography>
								<div ref={releaseNotesRef} />
								<div className={classes.actions}>
									<Button
										variant="contained"
										size="large"
										onClick={downloadInstallAction}
									>
										DOWNLOAD & INSTALL
									</Button>
									<Button variant="outlined" size="large" onClick={closeAction}>
										REMIND ME LATER
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

export default AutoUpdate;
