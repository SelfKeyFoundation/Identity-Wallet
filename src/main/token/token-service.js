'use strict';
import Token from './token';

export class TokenService {
	loadTokens() {
		return Token.findAll();
	}
}

export default TokenService;
