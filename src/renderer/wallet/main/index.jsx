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
	MarketplaceServiceDetailsPage
} from '../../marketplace';

import { SelfkeyIdContainer } from '../../selfkey-id/main';
import Transfer from '../../transaction/send';
import ReceiveTransfer from '../../transaction/receive';
import { walletTokensOperations } from 'common/wallet-tokens';

import { Grid, withStyles } from '@material-ui/core';
import Toolbar from './toolbar';
import { connect } from 'react-redux';

const styles = theme => ({
	headerSection: {
		width: '100%'
	},
	bodySection: {
		maxWidth: '1140px',
		width: '100%'
	}
});

const contentWrapperStyle = {
	marginBottom: '60px',
	marginTop: '50px'
};

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
				<Grid item xs={12} className={classes.bodySection} style={contentWrapperStyle}>
					<Route path={`${match.path}/dashboard/:tabid`} component={Dashboard} />
					<Route path={`${match.path}/addressBook`} component={AddressBook} />
					<Route path={`${match.path}/selfkeyId`} component={SelfkeyIdContainer} />
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
						path={`${match.path}/marketplace-services/:name`}
						component={MarketplaceServiceDetailsPage}
					/>
					<Route
						path={`${match.path}/marketplace-incorporation`}
						component={MarketplaceIncorporationPage}
					/>
					<Route
						path={`${match.path}/transfer/key`}
						render={props => <Transfer cryptoCurrency="KEY" />}
					/>
					<Route
						path={`${match.path}/transfer/eth`}
						render={props => <Transfer cryptoCurrency="ETH" />}
					/>
					<Route
						path={`${match.path}/transfer/custom`}
						render={props => <Transfer cryptoCurrency="" />}
					/>
					<Route
						path={`${match.path}/transfer/receive/:crypto`}
						render={props => (
							<ReceiveTransfer
								cryptoCurrency={props.match.params.crypto.toUpperCase()}
							/>
						)}
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
