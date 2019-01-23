import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelfkeyId from '../components/selfkey-id';
// import { identitySelectors, identityOperations } from 'common/identity';
// import { walletSelectors } from 'common/wallet';

class SelfkeyIdContainer extends Component {
	// componentDidMount() {
	// 	this.props.dispatch(identityOperations.unlockIdentityOperation());
	// }

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

	const documents = [
		{
			type: 'Passport',
			name: 'My ID Card',
			record: 'passport.pdf',
			expiryDate: '20 Dec 2021',
			lastEdited: '05 May 2018, 11:48 AM'
		},
		{
			name: 'Passport 2',
			record: 'passport2.png',
			expiryDate: '12 Dec 2019',
			lastEdited: '08 Jun 2017, 12:28 PM'
		},
		{
			name: 'Passport 3',
			record: 'passport3.pdf',
			expiryDate: '17 Dec 2021',
			lastEdited: '19 Dec 2018, 07:22 AM'
		}
	];

	const attributes = [
		{
			type: 'Passport',
			name: 'My ID Card',
			record: 'passport.pdf',
			expiryDate: '20 Dec 2021',
			lastEdited: '05 May 2018, 11:48 AM'
		},
		{
			type: 'Passport',
			name: 'My ID Card',
			record: 'passport.pdf',
			expiryDate: '20 Dec 2021',
			lastEdited: '05 May 2018, 11:48 AM'
		},
		{
			type: 'Passport',
			name: 'My ID Card',
			record: 'passport.pdf',
			expiryDate: '20 Dec 2021',
			lastEdited: '05 May 2018, 11:48 AM'
		},
		{
			type: 'Passport',
			name: 'My ID Card',
			record: 'passport.pdf',
			expiryDate: '20 Dec 2021',
			lastEdited: '05 May 2018, 11:48 AM'
		},
		{
			name: 'Passport',
			record: 'passport.png',
			expiryDate: '20 Dec 2021',
			lastEdited: '05 May 2018, 11:48 AM'
		}
	];

	// const attributes = identitySelectors.selectIdentity(state)
	// 	? identitySelectors.selectIdAttributes(state, walletSelectors.getWallet(state).id)
	// 	: [];
	console.log('state', state);
	return {
		attributeHistory,
		attributes,
		documents
	};
};

export default connect(mapStateToProps)(SelfkeyIdContainer);
