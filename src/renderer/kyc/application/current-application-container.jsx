import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kycSelectors, kycOperations } from '../../../common/kyc';
import { CurrentApplicationPopup } from './current-application-popup';

class CurrentApplicationComponent extends Component {
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
	render() {
		const { currentApplication, relyingParty } = this.props;
		return (
			<CurrentApplicationPopup
				currentApplication={currentApplication}
				relyingParty={relyingParty}
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
		currentApplication
	};
};

export const CurrentApplication = connect(mapStateToProps)(CurrentApplicationComponent);

export default CurrentApplication;
