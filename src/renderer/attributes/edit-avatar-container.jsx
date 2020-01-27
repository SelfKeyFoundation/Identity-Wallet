import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { identityOperations } from 'common/identity';
import EditAvatar from './edit-avatar';

class EditAvatarContainerComponent extends PureComponent {
	handleSave = (avatar, identityId) => {
		this.props.dispatch(identityOperations.updateProfilePictureOperation(avatar, identityId));
	};
	render() {
		const {
			identityId,
			avatar,
			open = true,
			text = 'Update Profile Picture',
			onClose
		} = this.props;
		return (
			<EditAvatar
				text={text}
				open={open}
				onSave={this.handleSave}
				onClose={onClose}
				avatar={avatar}
				identityId={identityId}
			/>
		);
	}
}

const mapStateToProps = (state, props) => ({});

export const EditAvatarContainer = connect(mapStateToProps)(EditAvatarContainerComponent);
export default EditAvatarContainer;
