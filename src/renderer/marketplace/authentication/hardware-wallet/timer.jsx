import React, { PureComponent } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import Popup from '../../../common/popup';
import { kycSelectors } from 'common/kyc';
import { hardwareWalletOperations } from 'common/hardware-wallet';
import { HourGlassLargeIcon } from 'selfkey-ui';
import { appSelectors } from 'common/app';

const styles = theme => ({});

class HardwareWalletTimer extends PureComponent {
	handleClose = () => {
		this.props.dispatch(
			hardwareWalletOperations.cancelAuthOperation({ cancelRoute: this.props.cancelRoute })
		);
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
									Confirm Authentication on {typeText}
								</Typography>
								<Typography variant="body1">
									You have 30 seconds to confirm this authentication on {typeText}{' '}
									or it will time out and automatically cancel.
								</Typography>
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

export default connect(mapStateToProps)(withStyles(styles)(HardwareWalletTimer));
