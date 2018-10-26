/* istanbul ignore file */
import reducer from './reducers';

import addressBookOperations from './operations';
import * as addressBookSelectors from './selectors';

export { addressBookOperations, addressBookSelectors };

export default reducer;
