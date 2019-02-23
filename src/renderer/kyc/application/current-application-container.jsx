import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kycSelectors, kycOperations } from '../../../common/kyc';
import { CurrentApplicationPopup } from './current-application-popup';
import { push } from 'connected-react-router';
import { CreateAttributePopup } from '../../selfkey-id/main/containers/create-attribute-popup';
import { EditAttributePopup } from '../../selfkey-id/main/containers/edit-attribute-popup';

class CurrentApplicationComponent extends Component {
	state = {
		selected: {},
		showCreateAttribute: false,
		showEditAttribute: false,
		editAttribute: {}
	};
	componentDidMount() {
		if (!this.props.currentApplication) return;
		if (this.props.rpShouldUpdate) {
			this.props.dispatch(
				kycOperations.loadRelyingParty(this.props.currentApplication.relyingPartyName)
			);
		}
	}
	handleSubmit = async () => {
		await this.props.dispatch(
			kycOperations.submitCurrentApplicationOperation(this.state.selected)
		);
		await this.props.dispatch(push(this.props.currentApplication.returnRoute));
	};
	handleClose = () => {
		this.props.dispatch(kycOperations.cancelCurrentApplicationOperation());
	};
	handleSelected = (uiId, item) => {
		const { selected } = this.state;
		if (selected[uiId] === item) return;
		this.setState({ selected: { ...selected, [uiId]: item } });
	};
	handleEdit = item => {
		if (item.options && item.options.length) {
			this.setState({ showEditAttribute: true, editAttribute: item.options[0] });
		} else {
			this.setState({ showCreateAttribute: true });
		}
	};
	handlePopupClose = () => {
		this.setState({ showEditAttribute: false, showCreateAttribute: false });
	};
	render() {
		const { currentApplication, relyingParty, requirements } = this.props;
		return (
			<div>
				<CurrentApplicationPopup
					currentApplication={currentApplication}
					relyingParty={relyingParty}
					requirements={requirements}
					onClose={this.handleClose}
					onSubmit={this.handleSubmit}
					selectedAttributes={this.state.selected}
					onSelected={this.handleSelected}
					editItem={this.handleEdit}
				/>
				{this.state.showCreateAttribute && (
					<CreateAttributePopup open={true} onClose={this.handlePopupClose} />
				)}
				{this.state.showEditAttribute && (
					<EditAttributePopup
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.editAttribute}
					/>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	const currentApplication = kycSelectors.selectCurrentApplication(state);
	if (!currentApplication) return {};
	return {
		relyingParty: kycSelectors.relyingPartySelector(state, currentApplication.relyingPartyName),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			currentApplication.relyingPartyName
		),
		currentApplication,
		requirements: kycSelectors.selectRequirementsForTemplate(
			state,
			currentApplication.relyingPartyName,
			currentApplication.templateId
		)
	};
};

export const CurrentApplication = connect(mapStateToProps)(CurrentApplicationComponent);

export default CurrentApplication;
