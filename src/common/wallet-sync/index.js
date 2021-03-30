// import { Logger } from 'common/logger';
import { createSelector } from 'reselect';
import { createAliasedSlice } from '../utils/duck';
import WalletConnectProvider from '@walletconnect/web3-provider';

// const log = new Logger('WalletSync');

const SLICE_NAME = 'walletSync';

const initialState = {
	serverUri: null
};

const selectSelf = state => state[SLICE_NAME];

const selectServerUri = createSelector(
	selectSelf,
	state => state.serverUri
);

const selectors = {
	selectServerUri
};

const initializeServer = ops => () => async (dispatch, getState) => {
	const provider = new WalletConnectProvider({
		// TODO: Need to create an ENV variable for it
		infuraId: '42c72df6422e4bc4847f137125953bc2',
		qrcode: false
	});

	ops.setServerUri(null);

	provider.connector.on('display_uri', (_, payload) => {
		const uri = payload.params[0];
		// goToSelfkey(`wc?uri=${uri}`)
		ops.setServerUri(uri);
	});

	await provider.enable();
};

const walletSync = createAliasedSlice({
	name: SLICE_NAME,
	initialState,
	reducers: {
		setServerUri(state, action) {
			state.serverUri = action.payload;
		}
	},
	aliasedOperations: {
		initializeServer
	}
});

const { reducer, operations } = walletSync;

export { operations as walletSyncOperations, selectors as walletSyncSelectors };

export default reducer;
