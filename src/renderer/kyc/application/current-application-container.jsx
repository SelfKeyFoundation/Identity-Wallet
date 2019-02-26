import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kycSelectors, kycOperations } from '../../../common/kyc';
import { CurrentApplicationPopup } from './current-application-popup';

class CurrentApplicationComponent extends Component {
	state = { selected: {}, agreementError: false, agreementValue: false };
	componentDidMount() {
		if (!this.props.currentApplication) return;
		if (this.props.rpShouldUpdate) {
			this.props.dispatch(
				kycOperations.loadRelyingParty(this.props.currentApplication.relyingPartyName)
			);
		}
	}
	handleAgreementChange = agreementValue => {
		this.setState({ agreementValue });
	};
	handleSubmit = () => {
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
		this.props.dispatch(kycOperations.submitCurrentApplicationOperation(this.state.selected));
	};
	handleClose = () => {
		this.props.dispatch(kycOperations.cancelCurrentApplicationOperation());
	};
	handleSelected = (uiId, item) => {
		const { selected } = this.state;
		if (selected[uiId] === item) return;
		this.setState({ selected: { ...selected, [uiId]: item } });
	};
	render() {
		const { currentApplication, relyingParty, requirements } = this.props;
		return (
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
			/>
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
