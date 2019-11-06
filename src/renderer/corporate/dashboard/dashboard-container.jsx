import React, { Component } from 'react';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import { CorporateDashboardPage } from './dashboard-page';
import { RegisterDidCardContainer } from '../../did';
import {
	CreateAttributeContainer,
	EditAttributeContainer,
	DeleteAttributeContainer
} from '../../attributes';

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

class CorporateDashboardContainer extends Component {
	state = {
		popup: null
	};

	componentDidUpdate() {
		if (this.props.identity.type !== 'corporate') {
			this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
	}

	handleAttributeDelete = attributeId =>
		this.props.dispatch(identityOperations.removeIdAttributeOperation(attributeId));

	handleEditAttribute = attribute => {
		this.setState({ popup: 'edit-attribute', editAttribute: attribute });
	};
	handleAddAttribute = () => {
		this.setState({ popup: 'create-attribute', isDocument: false });
	};
	handleAddDocument = () => {
		this.setState({ popup: 'create-attribute', isDocument: true });
	};
	handleDeleteAttribute = attribute => {
		this.setState({ popup: 'delete-attribute', deleteAttribute: attribute });
	};
	handlePopupClose = () => {
		this.setState({ popup: null });
	};

	render() {
		const { popup } = this.state;
		console.log(this.props);
		return (
			<React.Fragment>
				{popup === 'create-attribute' && (
					<CreateAttributeContainer
						corporate={true}
						open={true}
						onClose={this.handlePopupClose}
						isDocument={this.state.isDocument}
					/>
				)}
				{popup === 'edit-attribute' && (
					<EditAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.editAttribute}
					/>
				)}
				{popup === 'delete-attribute' && (
					<DeleteAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.deleteAttribute}
					/>
				)}

				<CorporateDashboardPage
					{...this.props}
					attributes={this.props.profile.attributes}
					documents={this.props.profile.documents}
					onAddAttribute={this.handleAddAttribute}
					onEditAttribute={this.handleEditAttribute}
					onDeleteAttribute={this.handleDeleteAttribute}
					onAddDocument={this.handleAddDocument}
					onEditDocument={this.handleEditAttribute}
					onDeleteDocument={this.handleDeleteAttribute}
					didComponent={
						<RegisterDidCardContainer returnPath={'/main/corporate-dashboard'} />
					}
				/>
			</React.Fragment>
		);
	}
}

const connectedComponent = connect(mapStateToProps)(CorporateDashboardContainer);
export { connectedComponent as CorporateDashboardContainer };
