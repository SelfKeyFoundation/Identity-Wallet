/* istanbul ignore file */
import reducer from './reducers';

import exchangesOperations from './operations';
import * as exchangesTypes from './types';
import * as exchangesSelectors from './selectors';

export { exchangesOperations, exchangesTypes, exchangesSelectors };

export default reducer;
