import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kycSelectors, kycOperations } from '../../../common/kyc';
import { CurrentApplicationPopup } from './current-application-popup';

class CurrentApplicationComponent extends Component {
	state = { selected: [] };
	componentDidMount() {
		console.log(this.props);
		if (!this.props.currentApplication) return;
		if (this.props.rpShouldUpdate) {
			this.props.dispatch(
				kycOperations.loadRelyingParty(this.props.currentApplication.relyingPartyName)
			);
		}
	}
	handleSubmit = () => {
		console.log('XXX', 'Submit current application');
		this.props.dispatch(kycOperations.cancelCurrentApplicationOperation());
	};
	handleClose = () => {
		this.props.dispatch(kycOperations.cancelCurrentApplicationOperation());
	};
	render() {
		const { currentApplication, relyingParty, requirements } = this.props;
		return (
			<CurrentApplicationPopup
				currentApplication={currentApplication}
				relyingParty={relyingParty}
				requirements={(requirements || []).map((r, ind) => ({
					...r,
					selected: this.state.selected[ind] || null
				}))}
				onClose={this.handleClose}
				onSubmit={this.handleSubmit}
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
