import React from 'react';
import jest from 'jest';
import { mount } from 'enzyme';

import Main from '././renderer/wallet/main';

describe('Wallet component', () => {
	it('sets Matomo Id on componentDidMount', () => {
		const spy = jest.spyOn(Main.prototype, 'setMatomoId');
		mount(<Main />);
		expect(spy).toHaveBeenCalled();
	});
});
