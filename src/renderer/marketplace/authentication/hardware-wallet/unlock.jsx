import React, { Component } from 'react';
import { Typography, Button, Grid, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import history from 'common/store/history';
import Popup from '../../../common/popup';
import { appSelectors } from 'common/app';
import { UnlockLargeIcon } from 'selfkey-ui';

const styles = theme => ({
	unlockIcon: {
		fontSize: '66px'
	}
});
class HardwareWalletUnlock extends Component {
	handleClose = () => {
		history.getHistory().goBack();
	};

	render() {
		const typeText = this.props.hardwareWalletType === 'ledger' ? 'Ledger' : 'Trezor';
		return (
			<Popup open={true} closeAction={this.handleClose} text="Unlock Device">
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					spacing={40}
				>
					<Grid item xs={2}>
						<UnlockLargeIcon className={this.props.classes.unlockIcon} />
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
								<Typography variant="h2">Please Unlock Your {typeText}</Typography>
								<Typography variant="body1">
									You need to confirm this authentication on your {typeText} in
									order to proceed. Please unlock it with your PIN.
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
		hardwareWalletType: appSelectors.selectApp(state).hardwareWalletType
	};
};

export default connect(mapStateToProps)(withStyles(styles)(HardwareWalletUnlock));
