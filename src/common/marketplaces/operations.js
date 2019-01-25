import { createAliasedAction } from 'electron-redux';
import { getGlobalContext } from '../context';
import { marketplacesSelectors } from './selectors';
import * as serviceSelectors from '../exchanges/selectors';
import * as walletSelectors from '../wallet/selectors';
import { identitySelectors } from '../identity';
import { marketplacesActions } from './actions';
import { marketplacesTypes } from './types';

export const loadTransactionsOperation = () => async (dispatch, getState) => {
	let mpService = (getGlobalContext() || {}).marketplaceService;
	let services = marketplacesSelectors.servicesSelector(getState()) || [];
	let transactions = await Promise.all(
		services.map(service => mpService.loadTransactions(service.serviceOwner, service.serviceId))
	);

	transactions = transactions.reduce((acc, curr) => {
		return acc.concat(curr);
	}, []);
	await dispatch(marketplacesActions.setTransactionsAction(transactions));
};

export const loadStakesOperation = () => async (dispatch, getState) => {
	let mpService = (getGlobalContext() || {}).marketplaceService;
	let services = marketplacesSelectors.servicesSelector(getState()) || [];
	let stakes = await Promise.all(
		services.map(service => mpService.loadStakingInfo(service.serviceOwner, service.serviceId))
	);
	await dispatch(marketplacesActions.setStakesAction(stakes));
};

export const placeStakeOperation = (serviceOwner, serviceId, amount, gasPrice, gasLimit) => async (
	dispatch,
	getState
) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;
	const newTransaction = await mpService.placeStake(
		serviceOwner,
		serviceId,
		amount,
		gasPrice,
		gasLimit
	);

	await dispatch(marketplacesActions.addTransactionAction(newTransaction));
};

export const withdrawStakeOperation = (serviceOwner, serviceId, gasPrice, gasLimit) => async (
	dispatch,
	getState
) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;

	const newTransaction = await mpService.withdrawStake(
		serviceOwner,
		serviceId,
		gasPrice,
		gasLimit
	);

	await dispatch(marketplacesActions.addTransactionAction(newTransaction));
};
export const updateTransactionStatusOperation = tx => async (dispatch, getState) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;
	const status = await mpService.checkMpTxStatus(tx);
	if (status === tx.lastStatus) return;

	tx = { ...tx, lastStatus: status };

	tx = await mpService.updateTransaction(tx);

	if (status === 'success') {
		let stake = await mpService.loadStakingInfo(tx.serviceOwner, tx.serviceId);
		await dispatch(marketplacesActions.updateStakeAction(stake));
	}
	await dispatch(marketplacesActions.updateTransactionAction(tx));
};

export const startStakeTransactionOperation = (serviceOwner, serviceId, amount) => async (
	dispatch,
	getState
) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;
	let currentTransaction = marketplacesSelectors.currentTransactionSelector(getState());
	let gasLimit = await mpService.estimateGasForStake(serviceOwner, serviceId);
	let tx = {
		action: 'placeStake',
		gasLimit,
		gasPrice: currentTransaction.gasPriceEstimates.average,
		serviceOwner,
		serviceId,
		amount
	};
	await dispatch(marketplacesActions.setCurrentTransactionAction(tx));
	await dispatch(marketplacesActions.showMarketplacePopupAction('confirmStakeTransaction'));
};

export const confirmStakeTransactionOperation = () => async (dispatch, getState) => {
	let tx = marketplacesSelectors.currentTransactionSelector(getState());
	await dispatch(
		marketplacesOperations.placeStake(
			tx.serviceOwner,
			tx.serviceId,
			tx.amount,
			tx.gasPrice,
			tx.gasLimit
		)
	);
	await dispatch(marketplacesActions.showMarketplacePopupAction('pendingTransaction'));
	await dispatch(marketplacesActions.clearCurrentTransactionAction());
};

export const startWithdrawTransactionOperation = (serviceOwner, serviceId) => async (
	dispatch,
	getState
) => {
	const mpService = (getGlobalContext() || {}).marketplaceService;
	let currentTransaction = marketplacesSelectors.currentTransactionSelector(getState());
	let gasLimit = await mpService.estimateGasForWithdraw(serviceOwner, serviceId);
	let tx = {
		action: 'withdrawStake',
		gasLimit,
		gasPrice: currentTransaction.gasPriceEstimates.average,
		serviceOwner,
		serviceId
	};
	await dispatch(marketplacesActions.setCurrentTransactionAction(tx));
	await dispatch(marketplacesActions.showMarketplacePopupAction('confirmWithdrawTransaction'));
};

export const confirmWithdrawTransactionOperation = (serviceOwner, serviceId) => async (
	dispatch,
	getState
) => {
	let tx = marketplacesSelectors.currentTransactionSelector(getState());
	await dispatch(
		marketplacesOperations.withdrawStake(
			tx.serviceOwner,
			tx.serviceId,
			tx.gasPrice,
			tx.gasLimit
		)
	);
	await dispatch(marketplacesActions.showMarketplacePopupAction('pendingTransaction'));
	await dispatch(marketplacesActions.clearCurrentTransactionAction());
};

export const cancelCurrentTransactionOperation = () => async (dispatch, getState) => {
	await dispatch(marketplacesActions.clearCurrentTransactionAction());
	await dispatch(marketplacesActions.showMarketplacePopupAction(null));
};

export const loadRelyingPartyOperation = rpName => async (dispatch, getState) => {
	let mpService = (getGlobalContext() || {}).marketplaceService;
	const ts = Date.now();
	const rp = serviceSelectors.getServiceDetails(getState(), rpName);
	const config = rp.relying_party_config;

	try {
		const session = mpService.createRelyingPartySession(config);
		await session.establish();
		const templates = await session.listKYCTemplates();
		const applications = await session.listKYCApplications();
		await dispatch(
			marketplacesActions.updateRelyingParty({
				name: rpName,
				templates,
				applications,
				session,
				lastUpdated: ts
			})
		);
	} catch (error) {
		await dispatch(
			marketplacesActions.updateRelyingParty(
				{
					name: rpName,
					lastUpdated: ts
				},
				error
			)
		);
	}
};

export const createRelyingPartyKYCApplication = (rpName, templateId, attributeIds) => async (
	dispatch,
	getState
) => {
	const rp = marketplacesSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');
	if (!rp.templates[templateId]) throw new Error('template does not exist');

	const wallet = walletSelectors.getWallet(getState());
	if (!wallet) return;
	const attributes = identitySelectors.selectFullIdAttributesByIds(
		getState(),
		wallet.id,
		attributeIds
	);
	const application = await rp.session.createKYCApplication(rpName, templateId, attributes);
	await dispatch(marketplacesActions.addKYCApplication(rpName, application));
};

export const marketplacesOperations = {
	...marketplacesActions,
	loadTransactions: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_LOAD,
		loadTransactionsOperation
	),
	loadStakes: createAliasedAction(marketplacesTypes.MARKETPLACE_STAKES_LOAD, loadStakesOperation),
	placeStake: createAliasedAction(
		marketplacesTypes.MARKETPLACE_STAKES_PLACE,
		placeStakeOperation
	),
	withdrawStake: createAliasedAction(
		marketplacesTypes.MARKETPLACE_STAKES_WITHDRAW,
		withdrawStakeOperation
	),
	updateTransactionStatus: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_UPDATE_STATUS,
		updateTransactionStatusOperation
	),
	startStakeTransaction: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_STAKE_START,
		startStakeTransactionOperation
	),
	confirmStakeTransaction: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_STAKE_CONFIRM,
		confirmStakeTransactionOperation
	),
	startWithdrawTransaction: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_WITHDRAW_START,
		startWithdrawTransactionOperation
	),
	confirmWithdrawTransaction: createAliasedAction(
		marketplacesTypes.MARKETPLACE_TRANSACTIONS_WITHDRAW_CONFIRM,
		confirmWithdrawTransactionOperation
	),
	loadRelyingParty: createAliasedAction(
		marketplacesTypes.MARKETPLACE_RP_LOAD,
		loadRelyingPartyOperation
	)
};
