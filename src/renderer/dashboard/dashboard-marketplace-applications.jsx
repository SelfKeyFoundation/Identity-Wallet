import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';

const styles = theme => ({
	bottomSpace: {
		marginBottom: '40px'
	},
	dmaWrap: {
		backgroundColor: '#262F39',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		padding: '20px 30px 30px'
	},
	title: {
		fontSize: '20px',
		marginBottom: '30px',
		marginTop: '5px'
	}
});

const EmptyState = ({ classes, route }) => (
	<>
		<Typography variant="body2" className={classes.bottomSpace}>
			You {"haven't"} applied for any service in the Marketplace
		</Typography>
		<Button variant="outlined" size="large" onClick={route}>
			Discover the marketplace
		</Button>
	</>
);

class DashboardMarketplaceApplications extends PureComponent {
	marketplaceRoute = () => {
		this.props.dispatch(push('marketplace'));
	};

	render() {
		const { classes } = this.props;
		return (
			<Grid item className={classes.dmaWrap}>
				<Typography variant="h1" className={classes.title}>
					Marketplace Applications
				</Typography>
				<EmptyState classes={this.props.classes} route={this.marketplaceRoute} />
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		// address: getWallet(state).address
	};
};

export default connect(mapStateToProps)(withStyles(styles)(DashboardMarketplaceApplications));