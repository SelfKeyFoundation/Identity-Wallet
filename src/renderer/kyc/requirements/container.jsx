import React, { PureComponent } from 'react';
import { KycRequirementsList } from './requirements-list';
import { connect } from 'react-redux';
import { kycSelectors, kycOperations } from '../../../common/kyc';

class KycRequirementsComponent extends PureComponent {
	componentDidMount() {
		if (this.props.rpShouldUpdate) {
			this.props.dispatch(kycOperations.loadRelyingParty(this.props.relyingPartyName));
		}
	}
	render() {
		const { requirements, title, subtitle, cols, relyingParty, rpShouldUpdate } = this.props;
		return (
			<KycRequirementsList
				requirements={requirements}
				loading={rpShouldUpdate && !relyingParty}
				title={title}
				subtitle={subtitle}
				cols={cols}
			/>
		);
	}
}

const mapStateToProps = (state, props) => ({
	relyingParty: kycSelectors.relyingPartySelector(state, props.relyingPartyName),
	rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(state, props.relyingPartyName),
	requirements: kycSelectors.selectRequirementsForTemplate(
		state,
		props.relyingPartyName,
		props.templateId
	)
});

export const KycRequirements = connect(mapStateToProps)(KycRequirementsComponent);
export default KycRequirements;
