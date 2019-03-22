import React from 'react';
import enzyme from 'enzyme';
import Main from './index.jsx';
// blocked on this https://github.com/airbnb/enzyme/pull/1966
describe('Wallet index', () => {
	xit('sets Matomo Id on componentDidMount', () => {
		const component = enzyme.shallow(<Main />);
		const wrapper = component.shallow();
		const instance = wrapper.dive().instance();
		jest.spyOn(instance, 'setMatomoId');
		instance.componentDidMount();
		expect(instance.setMatomoId).toHaveBeenCalled();
	});
});
