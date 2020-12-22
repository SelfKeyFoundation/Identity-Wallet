import moonPayAuth, { operations as authOperations, selectors as authSelectors } from './auth';

const moonPayOperations = { ...authOperations };
const moonPaySelectors = { ...authSelectors };

export { moonPayAuth, moonPayOperations, moonPaySelectors };
