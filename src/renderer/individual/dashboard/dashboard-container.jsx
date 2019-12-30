import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import { push } from 'connected-react-router';
import { RegisterDidCardContainer } from '../../did';
import { IndividualDashboardPage } from './dashboard-page';
import {
	CreateAttributeContainer,
	EditAttributeContainer,
	DeleteAttributeContainer,
	EditAvatarContainer
} from '../../attributes';

const MARKETPLACE_ROOT_PATH = '/main/marketplace';

class IndividualDashboardContainerComponent extends PureComponent {
	state = {
		popup: null
	};

	componentDidUpdate() {
		const { identity } = this.props.profile;
		if (identity.type !== 'individual') {
			this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
	}

	async componentDidMount() {
		const { identity } = this.props.profile;

		if (identity.type !== 'individual') {
			return this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
		if (!identity.isSetupFinished) {
			await this.props.dispatch(push('/main/individual/setup-individual-profile'));
		}
	}

	handleMarketplaceClick = () => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));

	handleAttributeDelete = attributeId =>
		this.props.dispatch(identityOperations.removeIdAttributeOperation(attributeId));

	handleEditAttribute = attribute => {
		this.setState({ popup: 'edit-attribute', editAttribute: attribute });
	};
	handleAddAttribute = (evt, member) => {
		this.setState({ popup: 'create-attribute', isDocument: false });
	};
	handleAddDocument = (evt, member) => {
		this.setState({ popup: 'create-attribute', isDocument: true });
	};
	handleDeleteAttribute = attribute => {
		this.setState({ popup: 'delete-attribute', deleteAttribute: attribute });
	};
	handleEditAvatar = () => {
		this.setState({ popup: 'edit-avatar' });
	};
	handlePopupClose = () => {
		this.setState({ popup: null });
	};

	render() {
		const { profile } = this.props;
		const { popup } = this.state;
		return (
			<React.Fragment>
				{popup === 'create-attribute' && (
					<CreateAttributeContainer
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
				{popup === 'edit-avatar' && (
					<EditAvatarContainer
						open={true}
						onClose={this.handlePopupClose}
						avatar={profile.profilePicture}
						identityId={profile.identity.id}
					/>
				)}

				<IndividualDashboardPage
					{...this.props}
					profile={profile}
					onMarketplaceClick={this.handleMarketplaceClick}
					onAddAttribute={this.handleAddAttribute}
					onEditAttribute={this.handleEditAttribute}
					onDeleteAttribute={this.handleDeleteAttribute}
					onAddDocument={this.handleAddDocument}
					onEditDocument={this.handleEditAttribute}
					onDeleteDocument={this.handleDeleteAttribute}
					onAvatarClick={this.handleEditAvatar}
					didComponent={<RegisterDidCardContainer returnPath={'/main/individual'} />}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		profile: identitySelectors.selectIndividualProfile(state)
	};
};

export const IndividualDashboardContainer = connect(mapStateToProps)(
	IndividualDashboardContainerComponent
);

export default IndividualDashboardContainer;
