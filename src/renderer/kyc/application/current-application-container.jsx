import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kycSelectors, kycOperations } from '../../../common/kyc';
import { CurrentApplicationPopup } from './current-application-popup';

class CurrentApplicationComponent extends Component {
	state = { selected: {} };
	componentDidMount() {
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
