import React from 'react';
import { shallow } from 'enzyme';
import SelfKeyIdCreateFormComponent from './selfkey-id-create.jsx';
// blocked on this https://github.com/airbnb/enzyme/pull/1966
describe('SelfKey ID Creation', () => {
	xit('Tracks Matomo Goal 1 on Form Submit', () => {
		const wrapper = shallow(<SelfKeyIdCreateFormComponent />);
		jest.spyOn(wrapper, 'sendMatomoGoal');
		expect(wrapper.sendMatomoGoal).toHaveBeenCalled();
	});
});
