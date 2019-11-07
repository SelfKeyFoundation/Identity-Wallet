import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { identityOperations } from 'common/identity';
import { Popup } from '../../../common/popup';
import EditAvatar from '../components/edit-avatar';

class EditAvatarPopupComponent extends PureComponent {
	handleSave = (avatar, identityId) => {
		this.props.dispatch(identityOperations.updateProfilePictureOperation(avatar, identityId));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		const { identityId, avatar, open = true, text = 'Update Profile Picture' } = this.props;
		return (
			<Popup open={open} closeAction={this.handleCancel} text={text}>
				<EditAvatar
					onSave={this.handleSave}
					onCancel={this.handleCancel}
					avatar={avatar}
					identityId={identityId}
				/>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => ({});
export const EditAvatarPopup = connect(mapStateToProps)(EditAvatarPopupComponent);

export default EditAvatarPopup;
