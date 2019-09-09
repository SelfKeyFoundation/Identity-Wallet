import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../../dashboard';
import { CryptoMangerContainer, AddTokenContainer } from '../../crypto-manager';
import AddressBook from '../../address-book/main';
import AddressBookAdd from '../../address-book/add';
import AddressBookEdit from '../../address-book/edit';
import { walletTokensOperations } from 'common/wallet-tokens';
import { walletSelectors } from 'common/wallet';
import { appSelectors } from 'common/app';

import {
	MarketplaceCategoriesPage,
	MarketplaceExchangesPage,
	MarketplaceIncorporationPage,
	MarketplaceBankAccountsPage,
	MarketplaceServiceDetailsPage,
	MarketplaceSelfkeyIdRequired,
	MarketplaceSelfkeyDIDRequiredContainer,
	MarketplaceOrdersPage
} from '../../marketplace';

import { SelfkeyIdContainer, AssociateDID } from '../../selfkey-id/main';
import Transfer from '../../transaction/send';
import AdvancedTransaction from '../../transaction/send/advanced-transaction';
import ReceiveTransfer from '../../transaction/receive';

import { Grid, withStyles } from '@material-ui/core';
import Toolbar from './toolbar';
import { connect } from 'react-redux';

import TransactionSendProgress from '../../transaction/progress/containers/transaction-send-progress-box';
import TransactionNoGasError from '../../transaction/transaction-no-gas-error/containers/transaction-no-gas-error';
import TransactionNoKeyError from '../../transaction/transaction-no-key-error/containers/transaction-no-key-error';
import TransactionError from '../../transaction/transaction-error/containers/transaction-error';
import TransactionDeclined from '../../transaction/transaction-declined/containers/transaction-declined';
import TransactionUnlock from '../../transaction/transaction-unlock';
import TransactionTimeout from '../../transaction/transaction-timeout';
import HardwareWalletTimer from '../../marketplace/authentication/hardware-wallet/timer';
import HardwareWalletTimeout from '../../marketplace/authentication/hardware-wallet/timeout';
import HardwareWalletDeclined from '../../marketplace/authentication/hardware-wallet/declined';
import HardwareWalletUnlock from '../../marketplace/authentication/hardware-wallet/unlock';
import HardwareWalletError from '../../marketplace/authentication/hardware-wallet/error';
import AuthenticationError from '../../marketplace/authentication/error';
import { CurrentApplication, ApplicationInProgress } from '../../kyc';

import md5 from 'md5';
import ReactPiwik from 'react-piwik';
import CreateDID from '../../selfkey-id/main/components/create-did';
import CreateDIDProcessing from '../../selfkey-id/main/components/create-did-processing';
import HardwareWalletTransactionTimer from '../../transaction/send/timer';

const styles = theme => ({
	headerSection: {
		marginLeft: 0,
		marginRi: 0,
		width: '100%'
	},
	bodySection: {
		maxWidth: '1080px',
		width: '100%'
	},
	'@media screen and (min-width: 1230px)': {
		bodySection: {
			maxWidth: '1140px'
		}
	},
	page: {}
});

const contentWrapperStyle = {
	marginBottom: '60px',
	marginRight: '-55px',
	marginTop: '128px'
};

class Main extends Component {
	setMatomoId = () => {
		ReactPiwik.push(['setUserId', md5(this.props.publicKey)]);
		ReactPiwik.push(['setCustomVariable', 1, 'machineId', window.machineId, 'visit']);
		ReactPiwik.push(['setCustomVariable', 2, 'walletType', this.props.walletType, 'visit']);
		ReactPiwik.push(['setCustomVariable', 3, 'walletVersion', window.appVersion, 'visit']);
	};
	async componentDidMount() {
		await this.props.dispatch(walletTokensOperations.loadWalletTokens());
		this.setMatomoId();
	}

	render() {
		const { match, classes } = this.props;
		return (
			<Grid
				container
				direction="column"
				justify="space-between"
				alignItems="center"
				className={classes.page}
			>
				<Grid item className={classes.headerSection}>
					<Toolbar />
				</Grid>
				<Grid item xs={12} className={classes.bodySection} style={contentWrapperStyle}>
					<Route path={`${match.path}/dashboard`} component={Dashboard} />
					<Route
						path={`${match.path}/crypto-manager`}
						component={CryptoMangerContainer}
					/>
					<Route path={`${match.path}/add-token`} component={AddTokenContainer} />
					<Route path={`${match.path}/addressBook`} component={AddressBook} />
					<Route
						path={`${match.path}/selfkeyId`}
						render={props => <SelfkeyIdContainer tabValue={0} />}
					/>
					<Route
						path={`${match.path}/selfkeyIdApplications`}
						render={props => <SelfkeyIdContainer tabValue={1} />}
					/>
					<Route path={`${match.path}/enter-did`} component={AssociateDID} />
					<Route path={`${match.path}/addressBookAdd`} component={AddressBookAdd} />
					<Route path={`${match.path}/addressBookEdit/:id`} component={AddressBookEdit} />
					<Route
						path={`${match.path}/marketplace-selfkey-id-required`}
						component={MarketplaceSelfkeyIdRequired}
					/>
					<Route
						path={`${match.path}/marketplace-selfkey-did-required`}
						component={MarketplaceSelfkeyDIDRequiredContainer}
					/>
					<Route
						path={`${match.path}/marketplace-categories`}
						component={MarketplaceCategoriesPage}
					/>
					<Route
						path={`${match.path}/marketplace-exchanges`}
						component={MarketplaceExchangesPage}
					/>
					<Route
						path={`${match.path}/marketplace-services/:inventoryId`}
						component={MarketplaceServiceDetailsPage}
					/>
					<Route
						path={`${match.path}/marketplace-incorporation`}
						component={MarketplaceIncorporationPage}
					/>
					<Route
						path={`${match.path}/marketplace-bank-accounts`}
						component={MarketplaceBankAccountsPage}
					/>
					<Route
						path={`${match.path}/marketplace-orders`}
						component={MarketplaceOrdersPage}
					/>
					<Route
						path={`${match.path}/transfer/:crypto`}
						render={props => (
							<Transfer cryptoCurrency={props.match.params.crypto.toUpperCase()} />
						)}
					/>
					<Route
						path={`${match.path}/transaction-progress`}
						component={TransactionSendProgress}
					/>
					<Route
						path={`${match.path}/transaction-no-gas-error`}
						component={TransactionNoGasError}
					/>
					<Route
						path={`${match.path}/transaction-no-key-error`}
						component={TransactionNoKeyError}
					/>
					<Route path={`${match.path}/transaction-error`} component={TransactionError} />
					<Route
						path={`${match.path}/transaction-declined/:device`}
						component={TransactionDeclined}
					/>
					<Route
						path={`${match.path}/transaction-unlock`}
						component={TransactionUnlock}
					/>
					<Route
						path={`${match.path}/transaction-timeout`}
						component={TransactionTimeout}
					/>
					<Route
						path={`${match.path}/hd-transaction-timer`}
						component={HardwareWalletTransactionTimer}
					/>
					<Route
						path={`${match.path}/advancedTransaction/:cryptoCurrency`}
						component={AdvancedTransaction}
					/>
					<Route
						path={`${match.path}/transfer/receive/:crypto`}
						render={props => (
							<ReceiveTransfer
								cryptoCurrency={props.match.params.crypto.toUpperCase()}
							/>
						)}
					/>
					<Route
						path={`${match.path}/kyc/current-application/:rpName`}
						component={CurrentApplication}
					/>
					<Route
						path={`${match.path}/kyc/application-in-progress`}
						component={ApplicationInProgress}
					/>
					<Route path={`${match.path}/hd-timer`} component={HardwareWalletTimer} />
					<Route path={`${match.path}/hd-timeout`} component={HardwareWalletTimeout} />
					<Route path={`${match.path}/hd-declined`} component={HardwareWalletDeclined} />
					<Route path={`${match.path}/hd-unlock`} component={HardwareWalletUnlock} />
					<Route path={`${match.path}/hd-error`} component={HardwareWalletError} />
					<Route path={`${match.path}/auth-error`} component={AuthenticationError} />

					<Route path={`${match.path}/get-did`} component={CreateDID} />
					<Route
						path={`${match.path}/create-did-processing`}
						component={CreateDIDProcessing}
					/>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		publicKey: walletSelectors.getWallet(state).publicKey,
		walletType: appSelectors.selectWalletType(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Main));
