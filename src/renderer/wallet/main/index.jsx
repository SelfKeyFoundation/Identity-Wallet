import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Dashboard from '../../dashboard';
import { CryptoMangerContainer, AddTokenContainer } from '../../crypto-manager';
import AddressBook from '../../address-book/main';
import AddressBookAdd from '../../address-book/add';
import AddressBookEdit from '../../address-book/edit';
import { walletTokensOperations } from 'common/wallet-tokens';
import { marketplaceOperations } from 'common/marketplace';
import { walletSelectors } from 'common/wallet';
import { appSelectors } from 'common/app';
import { getGlobalContext } from 'common/context';

import { MarketplaceContainer } from '../../marketplace';
import { CorporateContainer } from '../../corporate';
import { IndividualContainer } from '../../individual';

import {
	AssociateDIDContainer,
	CreateDIDPopupContainer,
	CreateDIDProcessingContainer
} from '../../did';

import Transfer from '../../transaction/send';
import AdvancedTransaction from '../../transaction/send/advanced-transaction';
import ReceiveTransfer from '../../transaction/receive';
import TokenSwap from '../../transaction/swap';
import { withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Toolbar from './toolbar-container';
import { connect } from 'react-redux';

import TransactionSendProgress from '../../transaction/progress/containers/transaction-send-progress-box';
import TransactionNoGasError from '../../transaction/transaction-no-gas-error/containers/transaction-no-gas-error';
import TransactionNoKeyError from '../../transaction/transaction-no-key-error/containers/transaction-no-key-error';
import TransactionError from '../../transaction/transaction-error/containers/transaction-error';
import TransactionDeclined from '../../transaction/transaction-declined/containers/transaction-declined';
import TransactionUnlock from '../../transaction/transaction-unlock';
import TransactionTimeout from '../../transaction/transaction-timeout';
import TransactionsHistoryModal from '../../transaction/transactions-history-modal';
import HardwareWalletTimer from '../../marketplace/authentication/hardware-wallet/timer';
import HardwareWalletTimeout from '../../marketplace/authentication/hardware-wallet/timeout';
import HardwareWalletDeclined from '../../marketplace/authentication/hardware-wallet/declined';
import HardwareWalletUnlock from '../../marketplace/authentication/hardware-wallet/unlock';
import HardwareWalletError from '../../marketplace/authentication/hardware-wallet/error';
import AuthenticationError from '../../marketplace/authentication/error';
import { CurrentApplication, ApplicationInProgress } from '../../kyc';
import WalletExportContainer from './export-container';
import { WalletExportWarning } from './export-warning';
import { WalletExportQRCode } from './export-qr-code';
import HardwareWalletTransactionTimer from '../../transaction/send/timer';
import { exchangesOperations } from '../../../common/exchanges';
import { SwapCompletedContainer } from '../../transaction/swap/swap-complete-container';
import { identitySelectors } from 'common/identity';
import { StakingDashboardContainer } from '../../staking/';

const styles = theme => ({
	headerSection: {
		marginLeft: 0,
		marginRi: 0,
		width: '100%'
	},
	bodySection: {
		maxWidth: '1074px',
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

class Main extends PureComponent {
	setMatomoId = () => {
		getGlobalContext().matomoService.setWalletContext(
			this.props.address,
			this.props.walletType
		);
	};
	async componentDidMount() {
		await this.props.dispatch(walletTokensOperations.loadWalletTokens());
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
		await this.props.dispatch(exchangesOperations.loadListingExchangesOperation());
		this.setMatomoId();
	}

	render() {
		const { match, classes, isExportable, isCorporate, isIndividual } = this.props;
		return (
			<Grid
				container
				direction="column"
				justify="space-between"
				alignItems="center"
				className={classes.page}
			>
				<Grid item className={classes.headerSection}>
					<Toolbar
						createPersonalProfile={this.createPersonalProfile}
						createCorporateProfile={this.createCorporateProfile}
					/>
				</Grid>
				<Grid item xs={12} className={classes.bodySection} style={contentWrapperStyle}>
					<Switch>
						<Route path={`${match.path}/dashboard`} component={Dashboard} />
						<Route
							path={`${match.path}/staking`}
							component={StakingDashboardContainer}
						/>
						<Route
							path={`${match.path}/crypto-manager`}
							component={CryptoMangerContainer}
						/>
						<Route path={`${match.path}/add-token`} component={AddTokenContainer} />
						<Route
							path={`${match.path}/swap-completed/:token`}
							component={SwapCompletedContainer}
						/>
						<Route path={`${match.path}/addressBook`} component={AddressBook} />

						{isIndividual && (
							<Redirect
								exact="1"
								from={`${match.path}/selfkeyId`}
								to={`${match.path}/individual/dashboard`}
							/>
						)}
						{isIndividual && (
							<Redirect
								exact="1"
								from={`${match.path}/selfkeyIdApplications`}
								to={`${match.path}/individual/dashboard/applications`}
							/>
						)}
						{isIndividual && (
							<Route
								path={`${match.path}/individual`}
								component={IndividualContainer}
							/>
						)}
						{isCorporate && (
							<Redirect
								from={`${match.path}/individual`}
								to={`${match.path}/corporate`}
							/>
						)}
						{isCorporate && (
							<Redirect
								exact="1"
								from={`${match.path}/selfkeyId`}
								to={`${match.path}/corporate/dashboard`}
							/>
						)}
						{isCorporate && (
							<Redirect
								exact="1"
								from={`${match.path}/selfkeyIdApplications`}
								to={`${match.path}/corporate/dashboard/applications`}
							/>
						)}

						<Route path={`${match.path}/corporate`} component={CorporateContainer} />

						<Route path={`${match.path}/enter-did`} component={AssociateDIDContainer} />
						<Route path={`${match.path}/addressBookAdd`} component={AddressBookAdd} />
						<Route
							path={`${match.path}/addressBookEdit/:id`}
							component={AddressBookEdit}
						/>
						<Route
							path={`${match.path}/marketplace`}
							component={MarketplaceContainer}
						/>
						<Route
							path={`${match.path}/transfer/:crypto`}
							render={props => (
								<Transfer
									cryptoCurrency={props.match.params.crypto.toUpperCase()}
								/>
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
							path={`${match.path}/transaction-no-key-error/:keyPrice?`}
							component={TransactionNoKeyError}
						/>
						<Route
							path={`${match.path}/transaction-error`}
							component={TransactionError}
						/>
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
							path={`${match.path}/transactions-history`}
							component={TransactionsHistoryModal}
						/>
						<Route
							path={`${match.path}/hd-transaction-timer`}
							component={HardwareWalletTransactionTimer}
						/>
						<Route
							path={`${match.path}/advancedTransaction/:cryptoCurrency`}
							component={AdvancedTransaction}
						/>
						<Route path={`${match.path}/token-swap`} component={TokenSwap} />
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
						<Route
							path={`${match.path}/hd-timeout`}
							component={HardwareWalletTimeout}
						/>
						<Route
							path={`${match.path}/hd-declined`}
							component={HardwareWalletDeclined}
						/>
						<Route path={`${match.path}/hd-unlock`} component={HardwareWalletUnlock} />
						<Route path={`${match.path}/hd-error`} component={HardwareWalletError} />
						<Route path={`${match.path}/auth-error`} component={AuthenticationError} />

						<Route path={`${match.path}/get-did`} component={CreateDIDPopupContainer} />
						<Route
							path={`${match.path}/create-did-processing`}
							component={CreateDIDProcessingContainer}
						/>

						{isExportable && (
							<Route
								path={`${match.path}/export-wallet/warning`}
								render={() => (
									<WalletExportContainer>
										{({ onCancel, onExport }) => (
											<WalletExportWarning
												onExport={onExport}
												onCancel={onCancel}
											/>
										)}
									</WalletExportContainer>
								)}
							/>
						)}
						{isExportable && (
							<Route
								path={`${match.path}/export-wallet/qr`}
								render={() => (
									<WalletExportContainer>
										{({ onCancel, keystore }) => (
											<WalletExportQRCode
												onCancel={onCancel}
												keystore={keystore}
											/>
										)}
									</WalletExportContainer>
								)}
							/>
						)}
					</Switch>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		isCorporate: identitySelectors.isCorporateIdentity(state),
		isIndividual: identitySelectors.isIndividualIdentity(state),
		address: walletSelectors.getWallet(state).address,
		walletType: appSelectors.selectWalletType(state),
		isExportable: appSelectors.selectCanExportWallet(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Main));
