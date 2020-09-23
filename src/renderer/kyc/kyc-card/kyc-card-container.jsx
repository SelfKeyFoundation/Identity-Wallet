import React, { PureComponent } from 'react';
import KycRequiredCard from './kyc-required-card';
import { kycOperations } from '../../../common/kyc';
import { connect } from 'react-redux';
import { withKycApplication } from '../application/with-kyc-application-hoc';
import KycInProgressCard from './kyc-in-progress-card';
import KycApprovedCard from './kyc-approved-card';
import KycAdditionalRequirementsCard from './kyc-additional-requirements-card';

class KycCardContainerComponent extends PureComponent {
	handleApplicationStart = () => {
		const {
			vendorId,
			templateId,
			vendor,
			cancelRoute,
			nextRoute,
			applicationTitle,
			applicationDescription,
			applicationAgreement
		} = this.props;
		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				vendorId,
				templateId,
				nextRoute,
				cancelRoute,
				applicationTitle,
				applicationDescription,
				applicationAgreement,
				vendor.name,
				vendor.privacyPolicy,
				vendor.termsOfService
			)
		);
	};

	handleApplicationRefresh = () => {
		this.props.dispatch(
			kycOperations.refreshRelyingPartyForKycApplication(
				this.props.lastApplication,
				'/main/staking',
				'/main/staking'
			)
		);
	};

	render() {
		const {
			kycRequirements,
			title,
			subtitle,
			cols,
			rp,
			rpShouldUpdate,
			applicationStatus
		} = this.props;

		return (
			<React.Fragment>
				{!applicationStatus || applicationStatus === 'rejected' ? (
					<KycRequiredCard
						requirements={kycRequirements}
						loading={rpShouldUpdate && !rp}
						applicationStatus={applicationStatus}
						onApplicationStart={this.handleApplicationStart}
						title={title}
						subtitle={subtitle}
						cols={cols}
					/>
				) : null}
				{applicationStatus === 'progress' ? (
					<KycInProgressCard onApplicationRefresh={this.handleApplicationRefresh} />
				) : null}
				{applicationStatus === 'completed' ? (
					<KycApprovedCard applicationStatus={applicationStatus} />
				) : null}
				{applicationStatus === 'additionalRequirements' ? (
					<KycAdditionalRequirementsCard
						applicationStatus={applicationStatus}
						onApplicationRefresh={this.handleApplicationRefresh}
					/>
				) : null}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => ({});

export const KycCardContainer = withKycApplication(
	connect(mapStateToProps)(KycCardContainerComponent)
);

export default KycCardContainer;
