import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appSelectors } from 'common/app';
import { CorporateWizard } from './corporate-wizard';
import { push } from 'connected-react-router';
import { identityOperations } from 'common/identity';

class CorporateWizardContainerComponent extends Component {
	state = {
		error: '',
		errorEmail: false,
		nickName: '',
		firstName: '',
		lastName: '',
		email: '',
		isDisabled: true
	};

	handleContinueClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(identityOperations.createCorporateProfileOperation());
	};

	handleCancelClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};
	render() {
		return (
			<CorporateWizard
				{...this.props}
				errors={{ email: this.props.errorEmail }}
				onContinueClick={this.handleContinueClick}
				onCancelClick={this.handleCancelClick}
			/>
		);
	}
}

// const dummyMembers = [
// 	{
// 		id: '1',
// 		name: 'Giacomo Guilizzoni',
// 		type: 'Person',
// 		role: 'Director, Shareholder',
// 		citizenship: 'Italy',
// 		residency: 'Singapore',
// 		shares: '45%'
// 	},
// 	{
// 		id: '2',
// 		name: 'Marco Botton Ltd',
// 		type: 'Corporate',
// 		role: 'Shareholder',
// 		citizenship: 'Hong Kong',
// 		residency: 'Hong Kong',
// 		shares: '9%'
// 	},
// 	{
// 		id: '3',
// 		name: 'Big Things Ltd',
// 		type: 'Corporate',
// 		role: 'Shareholder',
// 		citizenship: 'Hong Kong',
// 		residency: 'Hong Kong',
// 		shares: '41%'
// 	},
// 	{
// 		id: '4',
// 		name: 'John Dafoe',
// 		type: 'Person',
// 		role: 'Director',
// 		citizenship: 'France',
// 		residency: 'France',
// 		shares: '5%'
// 	}
// ];

const mapStateToProps = (state, props) => {
	return {
		walletType: appSelectors.selectWalletType(state)
		// members: dummyMembers
	};
};

export const CorporateWizardContainer = connect(mapStateToProps)(CorporateWizardContainerComponent);

export default CorporateWizardContainer;
