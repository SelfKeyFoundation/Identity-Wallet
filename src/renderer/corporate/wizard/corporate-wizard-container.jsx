import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appSelectors } from 'common/app';
import { CorporateWizard } from './corporate-wizard';

class CorporateWizardContainerComponent extends Component {
	render() {
		return <CorporateWizard {...this.props} />;
	}
}

const dummyMembers = [
	{
		id: '1',
		name: 'Giacomo Guilizzoni',
		type: 'Person',
		role: 'Director, Shareholder',
		citizenship: 'Italy',
		residency: 'Singapore',
		shares: '45%'
	},
	{
		id: '2',
		name: 'Marco Botton Ltd',
		type: 'Corporate',
		role: 'Shareholder',
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: '9%'
	},
	{
		id: '3',
		name: 'Big Things Ltd',
		type: 'Corporate',
		role: 'Shareholder',
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: '41%'
	},
	{
		id: '4',
		name: 'John Dafoe',
		type: 'Person',
		role: 'Director',
		citizenship: 'France',
		residency: 'France',
		shares: '5%'
	}
];

const mapStateToProps = (state, props) => {
	return {
		walletType: appSelectors.selectWalletType(state),
		members: dummyMembers
	};
};

export const CorporateWizardContainer = connect(mapStateToProps)(CorporateWizardContainerComponent);

export default CorporateWizardContainer;
