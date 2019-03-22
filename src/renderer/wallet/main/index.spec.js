import React from 'react';
import { shallow } from 'enzyme';
import Main from './index.jsx';
// blocked on this https://github.com/airbnb/enzyme/pull/1966
describe('Wallet index', () => {
	xit('sets Matomo Id on componentDidMount', () => {
		const wrapper = shallow(<Main />);
		const instance = wrapper
			.dive()
			.dive()
			.instance();
		jest.spyOn(instance, 'setMatomoId');
		instance.componentDidMount();
		expect(instance.setMatomoId).toHaveBeenCalled();
	});
});
