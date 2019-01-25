'use strict';
import Token from './token';
import { getGlobalContext } from 'common/context';
import { tokensOperations } from 'common/tokens';

export class TokenService {
	async loadTokens() {
		const importedTokens = await Token.findAll();
		const store = getGlobalContext().store;
		return store.dispatch(tokensOperations.updateTokens(importedTokens));
	}
}

export default TokenService;
