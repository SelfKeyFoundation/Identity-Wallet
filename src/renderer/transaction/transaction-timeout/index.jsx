import React, { PureComponent } from 'react';
import { Typography, Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import Popup from '../../common/popup';
import { appSelectors } from 'common/app';
import { HourGlassLargeIcon } from 'selfkey-ui';
import { push } from 'connected-react-router';

const styles = theme => ({});

class TransactionTimeout extends PureComponent {
	handleClose = async () => {
		await this.props.dispatch(push(this.props.goBackPath));
	};
	render() {
		const typeText =
			this.props.walletType.charAt(0).toUpperCase() + this.props.walletType.slice(1);
		const text = `${typeText} Timed Out`;
		return (
			<Popup open={true} closeAction={this.handleClose} text={text}>
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
								<Typography variant="body1">
									You did not confirm this transaction on your {typeText} so it
									was not sent to the network. Please try again and confirm the
									transaction on your device.
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
		walletType: appSelectors.selectWalletType(state),
		goBackPath: appSelectors.selectGoBackPath(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(TransactionTimeout));
