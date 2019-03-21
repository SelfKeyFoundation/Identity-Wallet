import React, { Component } from 'react';
import { Typography, Button, Grid, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Popup from '../../../common/popup';
import { kycSelectors } from 'common/kyc';
import { push } from 'connected-react-router';
import { HourGlassLargeIcon } from 'selfkey-ui';

const styles = theme => ({});

class HardwareWalletTimer extends Component {
	handleClose = () => {
		this.props.dispatch(push(this.props.cancelRoute));
	};

	render() {
		const typeText = this.props.hardwareWalletType === 'ledger' ? 'Ledger' : 'Trezor';
		return (
			<Popup open={true} closeAction={this.handleClose} text="Authentication Confirmation">
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					spacing={40}
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
							spacing={40}
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
							<Grid item>
								<Button
									color="secondary"
									variant="outlined"
									onClick={this.handleClose}
								>
									BACK
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
		cancelRoute: kycSelectors.selectCancelRoute(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(HardwareWalletTimer));
