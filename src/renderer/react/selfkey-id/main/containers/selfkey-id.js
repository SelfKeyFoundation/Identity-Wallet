import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelfkeyId from '../components/selfkey-id';

class SelfkeyIdContainer extends Component {
	render() {
		return <SelfkeyId {...this.props} />;
	}
}

const mapStateToProps = (state, props) => {
	const attributeHistory = [
		{
			timestamp: '2018-11-16 05:47',
			action: 'Created Attribute: Nationality'
		}
	];

	const attributes = [
		{
			name: 'Fisrt Name',
			record: 'Rob',
			lastedited: '2018-11-16 05:47'
		}
	];

	const documents = [
		{
			name: 'Passport',
			record: 'passport.png',
			lastedited: '2018-11-16 05:47'
		}
	];
	return { attributeHistory, attributes, documents };
};

export default connect(mapStateToProps)(SelfkeyIdContainer);
