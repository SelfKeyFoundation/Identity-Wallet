import React, { PureComponent } from 'react';
import { WarningShieldIcon } from 'selfkey-ui';
import { Popup } from '../common/popup';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Typography, Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	title: {
		marginBottom: '17px'
	},
	buttonContainer: {
		marginTop: '60px'
	}
});

class MarketplaceSelfkeyIdRequiredComponent extends PureComponent {
	handleConfirm = evt => {
		evt.preventDefault();
		this.props.dispatch(push('/main/selfkeyId'));
	};
	handleClose = () => {
		this.props.dispatch(push('/main/marketplace'));
	};
	render() {
		const { classes } = this.props;
		return (
			<Popup open={true} text="SelfKey ID Required" closeAction={this.handleClose}>
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
							spacing={1}
						>
							<Grid item>
								<Typography variant="h1" className={classes.title}>
									Please create a SelfKey ID
								</Typography>
								<Typography variant="body2" gutterBottom>
									You need to create a SelfKey profile in order to proceed. This
									will allow you to share any relevant information requested as
									part of the KYC Process.
								</Typography>
							</Grid>
							<Grid item className={classes.buttonContainer}>
								<Button
									variant="contained"
									size="large"
									onClick={this.handleConfirm}
								>
									Set up my SelfKey ID
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

export const MarketplaceSelfkeyIdRequired = connect()(
	withStyles(styles)(MarketplaceSelfkeyIdRequiredComponent)
);

export default MarketplaceSelfkeyIdRequired;
