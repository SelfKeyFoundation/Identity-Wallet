import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kycSelectors, kycOperations } from '../../../common/kyc';
import { CurrentApplicationPopup } from './current-application-popup';
import { CreateAttributePopup } from '../../selfkey-id/main/containers/create-attribute-popup';
import { EditAttributePopup } from '../../selfkey-id/main/containers/edit-attribute-popup';
import { jsonSchema } from 'common/identity/utils';

class CurrentApplicationComponent extends Component {
	state = {
		selected: {},
		showCreateAttribute: false,
		showEditAttribute: false,
		agreementError: false,
		agreementValue: false,
		editAttribute: {},
		typeId: -1,
		isDocument: false
	};
	componentDidMount() {
		if (!this.props.currentApplication) return;

		const authenticated = true;
		if (this.props.rpShouldUpdate) {
			this.props.dispatch(
				kycOperations.loadRelyingParty(
					this.props.currentApplication.relyingPartyName,
					authenticated,
					`/main/kyc/current-application/${
						this.props.currentApplication.relyingPartyName
					}`
				)
			);
		}
	}
	handleAgreementChange = agreementValue => {
		this.setState({ agreementValue });
	};
	handleSubmit = async () => {
		const { currentApplication, requirements } = this.props;
		const { agreementValue, selected } = this.state;
		if (currentApplication.agreement && !agreementValue) {
			this.setState({ agreementError: true });
			return;
		}
		const error = requirements.reduce((acc, curr) => {
			if (acc) return acc;
			if (!curr.options || !curr.options.length) return true;
			const attribute = selected[curr.uiId] || curr.options[0];
			if (!attribute || !attribute.isValid) return true;
			return false;
		}, false);
		if (error) {
			this.setState({ error });
			return;
		}

		await this.props.dispatch(
			kycOperations.submitCurrentApplicationOperation(this.state.selected)
		);
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
			this.setState({
				showEditAttribute: true,
				editAttribute: this.state.selected[item.id] || item.options[0]
			});
		} else {
			this.setState({
				showCreateAttribute: true,
				typeId: item.type.id,
				isDocument: jsonSchema.containsFile(item.type.content)
			});
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
					agreement={currentApplication.agreement}
					agreementValue={this.state.agreementValue}
					agreementError={this.state.agreementError}
					onAgreementChange={this.handleAgreementChange}
					error={this.state.error}
					relyingParty={relyingParty}
					requirements={requirements}
					onClose={this.handleClose}
					onSubmit={this.handleSubmit}
					selectedAttributes={this.state.selected}
					onSelected={this.handleSelected}
					editItem={this.handleEdit}
				/>
				{this.state.showCreateAttribute && (
					<CreateAttributePopup
						open={true}
						onClose={this.handlePopupClose}
						typeId={this.state.typeId}
						isDocument={this.state.isDocument}
					/>
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

const mapStateToProps = (state, props) => {
	const currentApplication = kycSelectors.selectCurrentApplication(state);
	if (!currentApplication) return {};
	const relyingPartyName = props.match.params.rpName;
	const authenticated = true;
	return {
		relyingParty: kycSelectors.relyingPartySelector(state, relyingPartyName),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			relyingPartyName,
			authenticated
		),
		currentApplication,
		requirements: kycSelectors.selectRequirementsForTemplate(
			state,
			relyingPartyName,
			currentApplication.templateId
		)
	};
};

export const CurrentApplication = connect(mapStateToProps)(CurrentApplicationComponent);

export default CurrentApplication;
