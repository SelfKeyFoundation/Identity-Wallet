import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { MarketplaceIcon } from 'selfkey-ui';

const styles = theme => ({
	bgIcon: {
		top: '39px',
		marginTop: '-112px',
		opacity: '0.5',
		position: 'relative',
		right: '-520px',
		zIndex: 0
	},
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
	},
	'@media screen and (min-width: 1230px)': {
		bgIcon: {
			right: '-559px'
		}
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
		<div className={classes.bgIcon}>
			<MarketplaceIcon width="135px" height="110px" fill="#313B49" />
		</div>
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
