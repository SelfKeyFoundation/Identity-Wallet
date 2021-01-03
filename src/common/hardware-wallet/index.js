import { Logger } from 'common/logger';
import config from 'common/config';
import { createAliasedSlice } from '../utils/duck';
import { createSelector } from 'reselect';
import { appSelectors } from 'common/app';
import { push } from 'connected-react-router';
import { navigationFlowOperations, navigationFlowSelectors } from '../navigation/flow';

const log = new Logger('HardwareWalletDuck');
const SLICE_NAME = 'hardwareWallet';
const CONFIRMATION_TIMEOUT = config.hwConfirmTimeout || 30000;
let timeout = null;
const initialState = {
	active: false,
	error: false
};

const selectSelf = state => state[SLICE_NAME];

const isActive = createSelector(
	selectSelf,
	({ active }) => active
);

const isHardwareWallet = createSelector(
	appSelectors.selectApp,
	({ walletType }) => {
		return ['trezor', 'ledger'].includes(walletType);
	}
);

const selectors = { isHardwareWallet, isActive };

const useHardwareWalletOperation = ops => (
	exec,
	{ silent = false, cancelUrl, completeUrl }
) => async (dispatch, getState) => {
	try {
		await dispatch(
			navigationFlowOperations.startFlow({
				cancel: cancelUrl,
				complete: completeUrl,
				name: 'hd-auth'
			})
		);
		if (!isHardwareWallet(getState())) {
			const res = await exec();
			await dispatch(navigationFlowOperations.navigateCompleteOperation());
			return res;
		}
		clearTimeout(timeout);
		if (isActive(getState())) {
			log.debug('starting hw operation while another is in progress');
			await dispatch(ops.cancel());
		}
		const timeoutPromise = new Promise((resolve, reject) => {
			timeout = setTimeout(async () => {
				reject(new Error('timeout'));
			}, CONFIRMATION_TIMEOUT);
		});

		await dispatch(push('/main/hd-timer'));

		const res = await Promise.race(timeoutPromise, exec());
		await dispatch(navigationFlowOperations());
		return res;
	} catch (error) {
		log.error(error);
		if (isHardwareWallet(getState()) && isActive(getState())) {
			await dispatch(ops.error());
			clearTimeout(timeout);
			if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
				await dispatch(push('/main/hd-declined'));
			} else if (error.code === 'Failure_ActionCancelled') {
				await dispatch(push('/main/hd-declined'));
			} else if (error.statusText === 'UNKNOWN_ERROR') {
				await dispatch(push('/main/hd-unlock'));
			} else if (error.message === 'timeout') {
				await dispatch(push('/main/hd-timeout'));
			} else {
				await dispatch(push('/main/hd-error'));
				if (!silent) throw error;
			}
			return;
		} else if (!silent) {
			throw error;
		}
		await dispatch(ops.cancelAuthOperation());
	}
};

const cancelAuthOperation = ops => (opts = {}) => async (dispatch, getState) => {
	if (isActive(getState())) {
		await dispatch(ops.cancel());
	}

	const flow = navigationFlowSelectors.getCurrentFlow(getState());

	if (!flow || flow.name !== 'hd-auth') {
		if (opts.cancelRoute) {
			await dispatch(push(opts.cancelRoute));
		}
		return;
	}

	await dispatch(navigationFlowOperations.navigateCancelOperation());
};

const hardwareWalletSlice = createAliasedSlice({
	name: SLICE_NAME,
	initialState,
	reducers: {
		start(state) {
			state.active = true;
		},
		error(state) {
			state.error = true;
		},
		cancel(state) {
			state.active = false;
			state.error = false;
		}
	},
	operations: {
		useHardwareWalletOperation,
		cancelAuthOperation
	}
});

const { reducer, operations } = hardwareWalletSlice;

export { operations as hardwareWalletOperations, selectors as hardwareWalletSelectors };

export default reducer;
