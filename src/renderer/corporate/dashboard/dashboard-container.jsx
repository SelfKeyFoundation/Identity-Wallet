import React from 'react';
import { connect } from 'react-redux';
import { identitySelectors } from 'common/identity';
import { CorporateDashboardPage } from './dashboard-page';

// TODO: to be replaced with real data
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

const dummyCorporateCapTable = [
	{
		type: 'Person',
		role: 'Director',
		name: 'John Doe',
		email: 'john.doe@email.com',
		citizenship: 'Italy',
		residency: 'Singapore',
		shares: 0.5,
		children: []
	},
	{
		type: 'Corporate',
		role: 'Shareholder',
		name: 'ACME Inc',
		email: null,
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: 0.09,
		children: dummyMembers
	},
	{
		type: 'Corporate',
		role: 'Shareholder',
		name: 'Apple Inc',
		email: null,
		citizenship: 'U.S.A.',
		residency: 'U.S.A.',
		shares: 0.41,
		children: []
	}
];

const mapStateToProps = (state, props) => {
	return {
		identity: identitySelectors.selectCurrentIdentity(state),
		profile: identitySelectors.selectCurrentCorporateProfile(state),
		applications: [], // marketplace applications,
		members: dummyMembers,
		cap: dummyCorporateCapTable
	};
};

const CorporateDashboardContainer = connect(mapStateToProps)(props => (
	<CorporateDashboardPage {...props} />
));

const connectedComponent = connect(mapStateToProps)(CorporateDashboardContainer);
export { connectedComponent as CorporateDashboardContainer };
