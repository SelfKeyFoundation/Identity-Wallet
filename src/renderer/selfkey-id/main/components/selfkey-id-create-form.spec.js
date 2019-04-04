import React from 'react';
import { shallow } from 'enzyme';
import SelfKeyIdCreateFormComponent from './selfkey-id-create.jsx';
// blocked on this https://github.com/airbnb/enzyme/pull/1966
describe('SelfKey ID Creation', () => {
	xit('Tracks Matomo Goal on Form Submit', () => {
		const wrapper = shallow(<SelfKeyIdCreateFormComponent />);
		const form = wrapper.dive().instance();
		form.find('button').simulate('click');
		expect(form.sendMatomoGoal).toHaveBeenCalled();
	});
});
