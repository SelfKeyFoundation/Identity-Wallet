import * as memoizedIdentitySelectors from './memoized-selectors';

import reducer, { initialState } from './reducers';
import { operations } from './operations';
export { identityOperations } from './operations';
export { identitySelectors } from './selectors';

export { identityReducers } from './reducers';
export { identityTypes } from './types';
export { identityActions } from './actions';
export const testExports = { operations };
export { initialState, memoizedIdentitySelectors };
export default reducer;
