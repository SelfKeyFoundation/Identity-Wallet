import React from 'react';
import { shallow } from 'enzyme';
import SelfKeyIdCreateDisclaimerComponent from './selfkey-id-create-disclaimer.jsx';
// blocked on this https://github.com/airbnb/enzyme/pull/1966
describe('SelfKeyId Disclaimer', () => {
	xit('Records Matomo goal on "accept"', () => {
		const wrapper = shallow(<SelfKeyIdCreateDisclaimerComponent />);
		const instance = wrapper
			.dive()
			.dive()
			.instance();
		jest.spyOn(instance, 'sendMatomoGoal');
		instance.componentDidMount();
		expect(instance.sendMatomoGoal).toHaveBeenCalled();
	});
});
