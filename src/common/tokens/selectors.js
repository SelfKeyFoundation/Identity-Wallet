export const tokensSelector = state => state.tokens;
export const allTokens = state => tokensSelector(state).tokens;
export const getTokenError = state => tokensSelector(state).tokenError;
