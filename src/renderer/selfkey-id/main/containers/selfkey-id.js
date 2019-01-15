import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelfkeyId from '../components/selfkey-id';
import { identitySelectors, identityOperations } from 'common/identity';
import { walletSelectors } from 'common/wallet';

class SelfkeyIdContainer extends Component {
	componentDidMount() {
		this.props.dispatch(identityOperations.unlockIdentityOperation());
	}

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
			name: 'Passport',
			record: 'passport.png',
			lastedited: '2018-11-16 05:47'
		}
	];

	const attributes = identitySelectors.selectIdentity(state)
		? identitySelectors.selectIdAttributes(state, walletSelectors.getWallet(state).id)
		: [];
	console.log('state', state);
	return {
		attributeHistory,
		attributes,
		documents
	};
};

export default connect(mapStateToProps)(SelfkeyIdContainer);
