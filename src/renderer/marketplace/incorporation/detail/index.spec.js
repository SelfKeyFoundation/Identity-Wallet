import React from 'react';
import { shallow } from 'enzyme';
import IncorporationsDetailView from './index.jsx';
// blocked on this https://github.com/airbnb/enzyme/pull/1966
describe('Wallet index', () => {
	xit('sets setEcommerceView on componentDidMount', () => {
		const wrapper = shallow(<IncorporationsDetailView />);
		const instance = wrapper
			.dive()
			.dive()
			.instance();
		jest.spyOn(instance, 'setEcommerceView');
		instance.componentDidMount();
		expect(instance.setEcommerceView).toHaveBeenCalled();
	});

	xit('clearEcommerceCart on componentWillUnmount', () => {
		const wrapper = shallow(<IncorporationsDetailView />);
		const instance = wrapper
			.dive()
			.dive()
			.instance();
		jest.spyOn(instance, 'clearEcommerceCart');
		instance.componentWillUnmount();
		expect(instance.clearEcommerceCart).toHaveBeenCalled();
	});
});
