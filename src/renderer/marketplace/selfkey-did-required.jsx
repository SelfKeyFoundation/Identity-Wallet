import React, { PureComponent } from 'react';
import { WarningShieldIcon } from 'selfkey-ui';
import { Popup } from '../common/popup';
import { Typography, withStyles, Button, Grid } from '@material-ui/core';

const styles = theme => ({
	title: {
		marginBottom: '17px'
	},
	buttonContainer: {
		marginTop: '60px'
	}
});

class MarketplaceSelfkeyDIDRequiredComponent extends PureComponent {
	render() {
		const { classes, onConfirm, onClose, onEnterDid } = this.props;
		return (
			<Popup open={true} text="SelfKey DID Required" closeAction={onClose}>
				<Grid container direction="row" justify="flex-start" alignItems="stretch">
					<Grid item xs={2}>
						<WarningShieldIcon />
					</Grid>
					<Grid item xs>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							spacing={8}
						>
							<Grid item>
								<Typography variant="h1" className={classes.title}>
									Please register on Selfkey network
								</Typography>
								<Typography variant="body2" gutterBottom>
									You need to create a SelfKey DID in order to proceed. We will
									use this unique id to identify you as a user of our network
								</Typography>
							</Grid>
							<Grid item className={classes.buttonContainer}>
								<Grid container direction="row" spacing={16}>
									<Grid item>
										<Button
											variant="contained"
											size="large"
											onClick={onConfirm}
										>
											Set up my DID
										</Button>
									</Grid>
									<Grid item>
										<Button
											variant="outlined"
											size="large"
											onClick={onEnterDid}
										>
											I have one
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

export const MarketplaceDIDRequired = withStyles(styles)(MarketplaceSelfkeyDIDRequiredComponent);

export default MarketplaceDIDRequired;
