import React, { PureComponent } from 'react';
import KycRequiredCard from './kyc-required-card';
import { kycSelectors, kycOperations } from '../../common/kyc';
import { connect } from 'react-redux';

class KycCardContainerComponent extends PureComponent {
	componentDidMount() {
		if (this.props.rpShouldUpdate) {
			this.props.dispatch(kycOperations.loadRelyingParty(this.props.relyingPartyName));
		}
	}
	render() {
		const { requirements, title, subtitle, cols, relyingParty, rpShouldUpdate } = this.props;
		return (
			<KycRequiredCard
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

export const KycCardContainer = connect(mapStateToProps)(KycCardContainerComponent);

export default KycCardContainer;
