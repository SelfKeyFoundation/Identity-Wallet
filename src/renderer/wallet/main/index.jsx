import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../../dashboard';
import AddressBook from '../../address-book/main';
import AddressBookAdd from '../../address-book/add';
import AddressBookEdit from '../../address-book/edit';

import {
	MarketplaceCategoriesPage,
	MarketplaceExchangesPage,
	MarketplaceIncorporationPage,
	MarketplaceServiceDetailsPage,
	MarketplaceDepositPopup,
	MarketplaceReturnDepositPopup,
	MarketplaceWithoutBalancePopup
} from '../../marketplace';

import { walletTokensOperations } from 'common/wallet-tokens';

import { Grid, withStyles } from '@material-ui/core';
import Toolbar from './toolbar';
import { connect } from 'react-redux';

const styles = theme => ({
	headerSection: {
		width: '100%'
	},
	bodySection: {
		maxWidth: '1140px'
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
				justify="space-between"
				alignItems="center"
				spacing={24}
			>
				<Grid item xs={12} className={classes.headerSection}>
					<Toolbar />
				</Grid>
				<Grid item xs={12} className={classes.bodySection}>
					<Route path={`${match.path}/dashboard`} component={Dashboard} />
					<Route path={`${match.path}/addressBook`} component={AddressBook} />
					<Route path={`${match.path}/addressBookAdd`} component={AddressBookAdd} />
					<Route path={`${match.path}/addressBookEdit/:id`} component={AddressBookEdit} />
					<Route
						path={`${match.path}/marketplace-categories`}
						component={MarketplaceCategoriesPage}
					/>
					<Route
						path={`${match.path}/marketplace-exchanges`}
						component={MarketplaceExchangesPage}
					/>
					<Route
						path={`${match.path}/marketplace-incorporation`}
						component={MarketplaceIncorporationPage}
					/>
					<Route
						path={`${match.path}/marketplace-services/:name`}
						component={MarketplaceServiceDetailsPage}
					/>
					<Route
						path={`${match.path}/marketplace-deposit`}
						component={MarketplaceDepositPopup}
					/>
					<Route
						path={`${match.path}/marketplace-return-deposit`}
						component={MarketplaceReturnDepositPopup}
					/>
					<Route
						path={`${match.path}/marketplace-no-balance`}
						component={MarketplaceWithoutBalancePopup}
					/>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Main));
