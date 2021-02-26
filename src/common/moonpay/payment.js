import config from 'common/config';
import { getGlobalContext } from 'common/context';
import { getWallet } from '../wallet/selectors';
import { marketplaceSelectors } from 'common/marketplace';
import { createSelector } from 'reselect';
import { createAliasedSlice } from '../utils/duck';
import { navigationFlowOperations } from '../navigation/flow';
import { selectIdentity } from '../identity/selectors';
import { push } from 'connected-react-router';
import { walletSelectors } from 'common/wallet';
import { selectors as authSelectors } from './auth';

const SLICE_NAME = 'moonPayPayment';

const initialState = {
	paymentError: null,
	selectedCard: null,
	cards: [],
	currencies: [],
	cryptoCurrency: 'KEY',
	baseCurrencyCode: 'USD',
	baseCurrencyAmount: 0,
	paymentMethod: 'credit_debit_card',
	quote: null,
	quoteError: false,
	transaction: null,
	transactions: [],
	isAuthenticating3dSecure: false
};

const selectSelf = state => state[SLICE_NAME];

const getPaymentError = createSelector(
	selectSelf,
	({ paymentError }) => paymentError
);

const getSelectedCard = createSelector(
	selectSelf,
	({ selectedCard }) => selectedCard
);

const getCards = createSelector(
	selectSelf,
	({ cards }) => cards
);

const getCryptoCurrency = createSelector(
	selectSelf,
	({ cryptoCurrency }) => cryptoCurrency
);

const getBaseCurrencyCode = createSelector(
	selectSelf,
	({ baseCurrencyCode }) => baseCurrencyCode
);

const getbaseCurrencyAmount = createSelector(
	selectSelf,
	({ baseCurrencyAmount }) => baseCurrencyAmount
);

const getPaymentMethod = createSelector(
	selectSelf,
	({ paymentMethod }) => paymentMethod
);

const getQuote = createSelector(
	selectSelf,
	({ quote }) => quote
);

const getQuoteError = createSelector(
	selectSelf,
	({ quoteError }) => quoteError
);

const getTransaction = createSelector(
	selectSelf,
	({ transaction }) => transaction
);

const getTransactions = createSelector(
	selectSelf,
	({ transactions }) => transactions
);

const getIsAuthenticating3dSecure = createSelector(
	selectSelf,
	({ isAuthenticating3dSecure }) => isAuthenticating3dSecure
);

const getCurrencies = createSelector(
	selectSelf,
	({ currencies }) => currencies
);

const getSupportedFiat = () => [
	'USD',
	'EUR',
	'GBP',
	'AUD',
	'BGN',
	'BRL',
	'CAD',
	'CHF',
	'CNY',
	'COP',
	'CZK',
	'DKK',
	'DOP',
	'EGP',
	'HKD',
	'HRK',
	'IDR',
	'ILS',
	'JPY',
	'JOD',
	'KES',
	'KRW',
	'KWD',
	'LKR',
	'MAD',
	'MXN',
	'MYR',
	'NGN',
	'NOK',
	'NZD',
	'OMR',
	'PEN',
	'PKR',
	'PLN',
	'RON',
	'RUB',
	'SEK',
	'SGD',
	'THB',
	'TRY',
	'TWD',
	'VND',
	'ZAR'
];

const selectors = {
	getPaymentError,
	getSelectedCard,
	getCards,
	getCryptoCurrency,
	getBaseCurrencyCode,
	getbaseCurrencyAmount,
	getPaymentMethod,
	getQuote,
	getQuoteError,
	getTransaction,
	getTransactions,
	getCurrencies,
	getIsAuthenticating3dSecure,
	getSupportedFiat
};

const paymentErrorOperation = ops => () => async (dispatch, getState) => {
	// await dispatch(ops.setAuthInfo(null));
};

const paymentFlowOperation = ops => ({ cancel, complete }) => async (dispatch, getState) => {
	const identity = selectIdentity(getState());

	if (!identity) {
		return;
	}

	if (!identity.isSetupFinished) {
		await dispatch(push('/main/selfkeyId'));
		return;
	}

	await dispatch(ops.setPaymentError(null));

	await dispatch(ops.setTransaction(null));

	await dispatch(ops.setQuote(null));

	await dispatch(ops.setQuoteError(false));

	await dispatch(ops.setIsAuthenticating3dSecure(false));

	if (!config.moonPayWidgetMode) {
		await dispatch(ops.loadUserCards());
		await dispatch(ops.loadTransactions());
		await dispatch(ops.loadCurrencies());

		await dispatch(
			navigationFlowOperations.startFlowOperation({
				name: 'moonpay-payment',
				current: '/main/moonpay/payment/select-card',
				cancel,
				complete
			})
		);
	} else {
		await dispatch(
			navigationFlowOperations.startFlowOperation({
				name: 'moonpay-payment',
				current: '/main/moonpay/payment/start-widget',
				cancel,
				complete
			})
		);
	}
};

const paymentFlowNextStepOperation = ops => opt => async (dispatch, getState) => {
	if (!config.moonPayWidgetMode) {
		const authenticated = authSelectors.isAuthenticated(getState());

		if (!authenticated) {
			// const loginEmail = authSelectors.getLoginEmail(getState());
			// const authInProgress = authSelectors.isAuthInProgress(getState());

			await dispatch(navigationFlowOperations.navigateCompleteOperation());
			return;
		}

		const card = getSelectedCard(getState());
		const transaction = getTransaction(getState());

		if (!card && !transaction) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/payment/select-card',
					next: '/main/moonpay/loading/payment-flow'
				})
			);
			return;
		}

		if (card && !transaction) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/payment/transaction',
					next: '/main/moonpay/loading/payment-flow'
				})
			);
			return;
		}

		if (
			transaction &&
			['waitingPayment', 'pending', 'waitingAuthorization'].includes(transaction.status)
		) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/payment/check',
					next: '/main/moonpay/loading/payment-flow'
				})
			);
			return;
		}

		if (transaction && ['failed'].includes(transaction.status)) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/payment/failed',
					next: '/main/moonpay/loading/payment-flow'
				})
			);
			return;
		}

		if (transaction && ['completed'].includes(transaction.status)) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/payment/completed',
					next: '/main/moonpay/loading/payment-flow'
				})
			);
			return;
		}
	} else {
		const transaction = getTransaction(getState());

		if (
			transaction &&
			['waitingPayment', 'pending', 'waitingAuthorization'].includes(transaction.status)
		) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/payment/check',
					next: '/main/moonpay/loading/payment-flow'
				})
			);
			return;
		}

		if (transaction && ['failed'].includes(transaction.status)) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/payment/failed',
					next: '/main/moonpay/loading/payment-flow'
				})
			);
			return;
		}

		if (transaction && ['completed'].includes(transaction.status)) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/payment/completed',
					next: '/main/moonpay/loading/payment-flow'
				})
			);
			return;
		}

		await dispatch(
			navigationFlowOperations.navigateToStepOperation({
				current: '/main/moonpay/payment/check',
				next: '/main/moonpay/loading/payment-flow'
			})
		);
		return;
	}

	await dispatch(navigationFlowOperations.navigateCompleteOperation());
};

const loadUserCards = ops => () => async (dispatch, getState) => {
	const { moonPayService } = getGlobalContext();
	const auth = authSelectors.selectAuthInfo(getState());
	const cards = await moonPayService.getCreditCards({ auth });
	await dispatch(ops.setCards(cards));
};

const addPaymentMethod = ops => ({ cardNumber, cvc, expiryDate }) => async (dispatch, getState) => {
	const { moonPayService } = getGlobalContext();
	const auth = authSelectors.selectAuthInfo(getState());
	const customer = authSelectors.getCustomer(getState());

	const card = await moonPayService.addPaymentMethod({
		number: cardNumber,
		expiryDate,
		cvc,
		billingAddress: customer.address,
		auth
	});
	if (card) {
		await dispatch(ops.setSelectedCard(card));
	}
};

const selectCard = ops => ({ card }) => async (dispatch, getState) => {
	await dispatch(ops.setQuoteError(false));
	await dispatch(ops.setTransaction(false));
	await dispatch(ops.setSelectedCard(card));
};

const calculateQuote = ops => ({ baseAmount, baseCurrencyCode }) => async (dispatch, getState) => {
	const { moonPayService } = getGlobalContext();
	const auth = authSelectors.selectAuthInfo(getState());

	if (baseAmount && baseCurrencyCode && auth) {
		const quote = await moonPayService.getQuote({
			auth,
			baseAmount,
			baseCurrencyCode,
			currencyCode: 'eth'
		});
		if (quote) {
			quote.totalFees = quote.extraFeeAmount + quote.feeAmount + quote.networkFeeAmount;
			await dispatch(ops.setQuote(quote));
			await dispatch(ops.setQuoteError(false));
			await dispatch(ops.setTransaction(false));
		}
	}
};

const quoteErrorOperation = ops => error => async (dispatch, getState) => {
	await dispatch(ops.setQuote(null));
	await dispatch(ops.setQuoteError(error));
};

const transactionOperation = ops => ({ baseAmount, baseCurrencyCode, currencyCode }) => async (
	dispatch,
	getState
) => {
	const state = getState();
	const { moonPayService } = getGlobalContext();
	const wallet = getWallet(state);
	const card = getSelectedCard(state);
	const auth = authSelectors.selectAuthInfo(state);
	const transaction = await moonPayService.createCardTransaction({
		auth,
		baseCurrencyAmount: +baseAmount,
		baseCurrencyCode,
		currencyCode,
		extraFeePercentage: 0,
		areFeesIncluded: true,
		walletAddress: wallet.address,
		cardId: card.id,
		returnUrl: 'http://localhost/whatever'
	});
	if (transaction && transaction.status === 'waitingAuthorization' && transaction.redirectUrl) {
		await dispatch(ops.setIsAuthenticating3dSecure(true));
		await moonPayService.redirectTo3dSecure(transaction);
	}
	if (transaction) {
		await dispatch(ops.setTransaction(transaction));
	}
};

const refreshTransactionOperation = ops => () => async (dispatch, getState) => {
	const state = getState();
	const { moonPayService } = getGlobalContext();
	const transaction = getTransaction(state);
	const isAuthenticating3dSecure = getIsAuthenticating3dSecure(state);

	const auth = authSelectors.selectAuthInfo(state);

	if (!isAuthenticating3dSecure) {
		const refreshedTransaction = await moonPayService.getTransaction({
			auth,
			transactionId: transaction.id
		});
		if (refreshedTransaction) {
			await dispatch(ops.setTransaction(refreshedTransaction));
		}
	}
};

const completed3dSecureOperation = ops => () => async (dispatch, getState) => {
	await dispatch(ops.setIsAuthenticating3dSecure(false));
};

const loadTransactions = ops => () => async (dispatch, getState) => {
	const state = getState();
	const { moonPayService } = getGlobalContext();
	const auth = authSelectors.selectAuthInfo(state);
	const transactions = await moonPayService.listTransactions({ auth });
	if (transactions) {
		await dispatch(ops.setTransactions(transactions));
	}
};

const loadTransaction = ops => transactionId => async (dispatch, getState) => {
	const { moonPayService } = getGlobalContext();
	const transaction = await moonPayService.getTransaction({ transactionId });
	if (transaction) {
		await dispatch(ops.setTransaction(transaction));
	}
};

const loadCurrencies = ops => () => async (dispatch, getState) => {
	const state = getState();
	const { moonPayService } = getGlobalContext();
	const auth = authSelectors.selectAuthInfo(state);
	const currencies = await moonPayService.listCurrencies({ auth });
	if (currencies) {
		await dispatch(ops.setCurrencies(currencies));
	}
};

const openWidget = ops => () => async (dispatch, getState) => {
	const state = getState();
	const loginEmail = authSelectors.getLoginEmail(getState());
	const wallet = walletSelectors.getWallet(state);
	const { moonPayService } = getGlobalContext();
	// const auth = authSelectors.selectAuthInfo(state);
	const vendor = marketplaceSelectors.selectVendorById(getState(), 'moonpay');
	await moonPayService.openWidget({
		email: loginEmail,
		address: wallet.address,
		key: vendor.relyingPartyConfig.key,
		secret: vendor.relyingPartyConfig.secret
	});
};

const moonPayPaymentSlice = createAliasedSlice({
	name: SLICE_NAME,
	initialState,
	reducers: {
		setPaymentError(state, action) {
			state.paymentError = action.payload;
		},
		setSelectedCard(state, action) {
			state.selectedCard = action.payload;
		},
		setCards(state, action) {
			state.cards = action.payload;
		},
		setCryptoCurrency(state, action) {
			state.cryptoCurrency = action.payload;
		},
		setBaseCurrencyCode(state, action) {
			state.baseCurrencyCode = action.payload;
		},
		setBaseCurrencyAmount(state, action) {
			state.baseCurrencyAmount = action.payload;
		},
		setPaymentMethod(state, action) {
			state.paymentMethod = action.payload;
		},
		setQuote(state, action) {
			state.quote = action.payload;
		},
		setQuoteError(state, action) {
			state.quoteError = action.payload;
		},
		setTransaction(state, action) {
			state.transaction = action.payload;
		},
		setTransactions(state, action) {
			state.transactions = action.payload;
		},
		setCurrencies(state, action) {
			state.currencies = action.payload;
		},
		setIsAuthenticating3dSecure(state, action) {
			state.isAuthenticating3dSecure = action.payload;
		}
	},
	aliasedOperations: {
		paymentFlowOperation,
		paymentFlowNextStepOperation,
		paymentErrorOperation,
		addPaymentMethod,
		loadUserCards,
		selectCard,
		calculateQuote,
		quoteErrorOperation,
		transactionOperation,
		refreshTransactionOperation,
		completed3dSecureOperation,
		loadTransactions,
		loadTransaction,
		loadCurrencies,
		openWidget
	}
});

const { reducer, operations } = moonPayPaymentSlice;

export { operations, selectors };

export default reducer;
