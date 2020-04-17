import React, { PureComponent } from 'react';
import { Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import HelpStepsSection from './help-steps-section';
import { push } from 'connected-react-router';

const styles = theme => ({
	root: {
		flexGrow: 1
	}
});

class Ledger extends PureComponent {
	handleConnectAction = async () => {
		await this.props.dispatch(push('/connectingToLedger'));
	};

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Grid container direction="column" justify="center" alignItems="center" spacing={3}>
					<HelpStepsSection />
					<Grid item>
						<Button variant="contained" size="large" onClick={this.handleConnectAction}>
							CONNECT TO LEDGER
						</Button>
					</Grid>
				</Grid>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Ledger));
