/* istanbul ignore file */
import reducer from './reducers';

import walletOperations from './operations';
import * as walletSelectors from './selectors';
import * as walletTypes from './types';

export { walletOperations, walletTypes, walletSelectors };

export default reducer;
