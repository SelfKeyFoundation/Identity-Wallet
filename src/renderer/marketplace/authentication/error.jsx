import React, { PureComponent } from 'react';
import { Typography, Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import Popup from '../../common/popup';
import { HourGlassLargeIcon } from 'selfkey-ui';
import { kycSelectors } from 'common/kyc';
import { push } from 'connected-react-router';

const styles = theme => ({});

class AuthenticationError extends PureComponent {
	handleClose = () => {
		this.props.dispatch(push(this.props.cancelRoute));
	};

	render() {
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
								<Typography variant="h2">Authentication Error</Typography>
								<Typography variant="body1">
									There was an error when authenticating with the service. Please
									try again.
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
		cancelRoute: kycSelectors.selectCancelRoute(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(AuthenticationError));
