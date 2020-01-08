import * as identitySelectors from './selectors';

import reducer, { initialState } from './reducers';
import { operations } from './operations';
export { identityOperations } from './operations';

export { identityReducers } from './reducers';
export { identityTypes } from './types';
export { identityActions } from './actions';
export const testExports = { operations };
export { initialState, identitySelectors };
export default reducer;
