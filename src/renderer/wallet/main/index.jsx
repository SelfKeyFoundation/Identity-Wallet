import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../../dashboard';
import AddressBook from '../../address-book/main';
import Marketplace from '../../marketplace';
import Exchanges from '../../marketplace/exchanges';
import Unlock from '../../marketplace/unlock-container';
import Return from '../../marketplace/return-container';
import WithoutBalance from '../../marketplace/no-balance';
import Item from '../../marketplace/item';
import { walletTokensOperations } from 'common/wallet-tokens';

import { Grid, withStyles } from '@material-ui/core';
import Toolbar from './toolbar';
import { connect } from 'react-redux';

const styles = theme => ({
	wrapper: {},
	headerSection: {
		width: '100%'
	},
	bodySection: {
		width: '100%'
	}
});

class Main extends Component {
	componentDidMount() {
		this.props.dispatch(walletTokensOperations.loadWalletTokens());
	}

	render() {
		const { match, classes } = this.props;
		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				className={classes.wrapper}
			>
				<Grid item xs={12} className={classes.headerSection}>
					<Toolbar />
				</Grid>
				<Grid item xs={12} className={classes.bodySection}>
					<Route path={`${match.path}/dashboard`} component={Dashboard} />
					<Route path={`${match.path}/addressBook`} component={AddressBook} />
					<Route path={`${match.path}/marketplace`} component={Marketplace} />
					<Route path={`${match.path}/exchanges`} component={Exchanges} />
					<Route path={`${match.path}/marketplaceItem/:name`} component={Item} />
					<Route path={`${match.path}/marketplaceUnlock`} component={Unlock} />
					<Route path={`${match.path}/marketplaceReturn`} component={Return} />
					<Route path={`${match.path}/marketplaceNoBalance`} component={WithoutBalance} />
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Main));
