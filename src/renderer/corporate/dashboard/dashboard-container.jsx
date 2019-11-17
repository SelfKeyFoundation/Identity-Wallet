import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { identityOperations, identitySelectors } from 'common/identity';
import { CorporateDashboardPage } from './dashboard-page';
import { RegisterDidCardContainer } from '../../did';
import {
	CreateAttributeContainer,
	EditAttributeContainer,
	DeleteAttributeContainer
} from '../../attributes';

const mapStateToProps = (state, props) => {
	const profile = identitySelectors.selectCorporateProfile(state);
	return {
		identity: identitySelectors.selectIdentity(state),
		profile,
		applications: [], // marketplace applications,
		members: profile.members,
		cap: []
	};
};

class CorporateDashboardContainer extends PureComponent {
	state = {
		popup: null
	};

	componentDidUpdate() {
		if (this.props.identity.type !== 'corporate') {
			this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
	}

	handleAddMember = () => this.props.dispatch(push('/main/corporate/add-member'));

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
					onAddMember={this.handleAddMember}
					didComponent={<RegisterDidCardContainer returnPath={'/main/corporate'} />}
				/>
			</React.Fragment>
		);
	}
}

const connectedComponent = connect(mapStateToProps)(CorporateDashboardContainer);
export { connectedComponent as CorporateDashboardContainer };
