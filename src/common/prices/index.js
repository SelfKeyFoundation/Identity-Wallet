/* istanbul ignore file */
import reducer from './reducers';

import pricesOperations from './operations';
import * as pricesTypes from './types';
import * as pricesSelectors from './selectors';

export { pricesOperations, pricesTypes, pricesSelectors };

export default reducer;
