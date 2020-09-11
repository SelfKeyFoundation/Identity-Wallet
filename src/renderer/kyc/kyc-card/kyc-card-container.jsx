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
		const { vendorId, templateId, vendor, cancelRoute, nextRoute } = this.props;
		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				vendorId,
				templateId,
				nextRoute,
				cancelRoute,
				`Bank Account`,
				`You are about to begin the application process for a bank account in.
				Please double check your required documents are Certified True or Notarized where
				necessary. Failure to do so will result in delays in the process. You may also be
				asked to provide more information by the service provider`,
				'conducting KYC',
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
