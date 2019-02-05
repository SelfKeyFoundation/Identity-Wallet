import React, { Component } from 'react';
import { Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import HelpStepsSection from './help-steps-section';
import Connecting from './connecting';
import { appSelectors } from 'common/app';
import { push } from 'connected-react-router';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Ledger extends Component {
	state = {
		isConnecting: false,
		selectAddress: false
	};

	handleConnectAction = () => {
		this.setState({ isConnecting: true });
	};

	handleConnectingOnClose = async () => {
		this.setState({ isConnecting: false });
		if (this.props.hasConnected) {
			await this.props.dispatch(push('/selectAddress'));
		}
	};

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="center"
					spacing={24}
				>
					<HelpStepsSection />
					<Grid item>
						<Button variant="contained" size="large" onClick={this.handleConnectAction}>
							CONNECT TO LEDGER
						</Button>
					</Grid>
				</Grid>
				<Connecting open={this.state.isConnecting} onClose={this.handleConnectingOnClose} />
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		hasConnected: appSelectors.hasConnected(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Ledger));
