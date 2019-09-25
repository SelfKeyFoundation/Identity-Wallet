import React, { Component } from 'react';
import { connect } from 'react-redux';
import { identityOperations } from 'common/identity';
import SelfkeyIdOverview from '../components/selfkey-id-overview';

import { CreateAttributePopup } from './create-attribute-popup';
import { EditAttributePopup } from './edit-attribute-popup';
import { DeleteAttributePopup } from './delete-attribute-popup';
import { EditAvatarPopup } from './edit-avatar-popup';
import { RegisterDidCardContainer } from '../../../did';

class SelfkeyIdOverviewContainerComponent extends Component {
	state = {
		popup: null
	};

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
	handleAvatarClick = () => {
		this.setState({ popup: 'edit-avatar' });
	};

	render() {
		const { popup } = this.state;
		const { profilePicture, identity } = this.props;
		return (
			<React.Fragment>
				{popup === 'create-attribute' && (
					<CreateAttributePopup
						open={true}
						onClose={this.handlePopupClose}
						isDocument={this.state.isDocument}
					/>
				)}
				{popup === 'edit-attribute' && (
					<EditAttributePopup
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.editAttribute}
					/>
				)}
				{popup === 'delete-attribute' && (
					<DeleteAttributePopup
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.deleteAttribute}
					/>
				)}
				{popup === 'edit-avatar' && (
					<EditAvatarPopup
						open={true}
						onClose={this.handlePopupClose}
						avatar={profilePicture}
						identityId={identity.id}
					/>
				)}
				<SelfkeyIdOverview
					didCard={!this.props.identity.did ? <RegisterDidCardContainer /> : null}
					onGetDid={this.handleGetDid}
					onEnterDid={this.handleEnterDid}
					onDeleteAttribute={this.handleDeleteAttribute}
					onEditAttribute={this.handleEditAttribute}
					onAddAttribute={this.handleAddAttribute}
					onAddDocument={this.handleAddDocument}
					onAvatarClick={this.handleAvatarClick}
					{...this.props}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};
export const SelfkeyIdOverviewContainer = connect(mapStateToProps)(
	SelfkeyIdOverviewContainerComponent
);

export default SelfkeyIdOverviewContainer;
