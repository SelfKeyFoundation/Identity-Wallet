import { Logger } from 'common/logger';
import config from 'common/config';
import { createAliasedSlice } from '../utils/duck';
import { createSelector } from 'reselect';
import { appSelectors } from 'common/app';
import { push } from 'connected-react-router';
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

const useHardwareWalletOperation = ops => (exec, silent = false) => async (dispatch, getState) => {
	try {
		if (!isHardwareWallet(getState())) {
			return exec();
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
		return res;
	} catch (error) {
		log.error(error);
		if (isHardwareWallet(getState())) {
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
		} else if (!silent) {
			throw error;
		}
	}
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
		}
	},
	operations: {
		useHardwareWalletOperation
	}
});

const { reducer, operations } = hardwareWalletSlice;

export { operations as hardwareWalletOperations, selectors as hardwareWalletSelectors };

export default reducer;
