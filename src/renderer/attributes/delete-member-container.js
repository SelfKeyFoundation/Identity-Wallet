import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { identityOperations } from 'common/identity';
import DeleteMember from './delete-member';

class DeleteMemberContainerComponent extends PureComponent {
	handleConfirm = member => {
		this.props.dispatch(identityOperations.deleteIdentityOperation(member.identity.id));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		const { member, open = true, text = 'Delete Information and History' } = this.props;
		return (
			<DeleteMember
				open={open}
				text={text}
				onConfirm={this.handleConfirm}
				onCancel={this.handleCancel}
				member={member}
			/>
		);
	}
}

const mapStateToProps = (state, props) => ({});
export const DeleteMemberContainer = connect(mapStateToProps)(DeleteMemberContainerComponent);

export default DeleteMemberContainer;
