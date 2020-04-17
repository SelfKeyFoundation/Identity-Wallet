import React, { PureComponent } from 'react';
import { Typography, Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import Popup from '../../../common/popup';
import { HourGlassLargeIcon } from 'selfkey-ui';
import { kycSelectors } from 'common/kyc';
import { push } from 'connected-react-router';
import { appSelectors } from 'common/app';

const styles = theme => ({});

class HardwareWalletError extends PureComponent {
	handleClose = () => {
		this.props.dispatch(push(this.props.cancelRoute));
	};

	render() {
		const typeText =
			this.props.walletType.charAt(0).toUpperCase() + this.props.walletType.slice(1);
		return (
			<Popup open={true} closeAction={this.handleClose} text="Authentication Confirmation">
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					spacing={5}
				>
					<Grid item xs={2}>
						<HourGlassLargeIcon />
					</Grid>
					<Grid item xs={10}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							spacing={5}
						>
							<Grid item>
								<Typography variant="h2">
									Authentication Error with {typeText}
								</Typography>
								<Typography variant="body1">
									There was an error when authenticating with the service using
									your {typeText}. Please try again.
								</Typography>
							</Grid>
							<Grid item>
								<Button
									color="secondary"
									variant="outlined"
									onClick={this.handleClose}
								>
									Back
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		cancelRoute: kycSelectors.selectCancelRoute(state),
		walletType: appSelectors.selectWalletType(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(HardwareWalletError));
