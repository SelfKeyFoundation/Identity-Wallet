/* istanbul ignore file */
import reducer from './reducers';

import fiatCurrencyOperations from './operations';
import * as fiatCurrencyTypes from './types';
import * as fiatCurrencySelectors from './selectors';

export { fiatCurrencyOperations, fiatCurrencyTypes, fiatCurrencySelectors };

export default reducer;
