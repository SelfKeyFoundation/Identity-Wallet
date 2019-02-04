import React, { Component } from 'react';
import { Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import HelpStepsSection from './help-steps-section';
import Connecting from './connecting';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Ledger extends Component {
	state = {
		isConnecting: false
	};

	handleConnectAction = () => {
		this.setState({ isConnecting: true });
	};

	handleConnectingOnClose = () => {
		this.setState({ isConnecting: false });
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
						<Button variant="contained" onClick={this.handleConnectAction}>
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
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Ledger));
