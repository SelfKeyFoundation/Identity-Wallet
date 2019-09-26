import React, { Component } from 'react';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { kycOperations } from 'common/kyc';
import { marketplaceSelectors, marketplaceOperations } from 'common/marketplace';
import { appSelectors } from 'common/app';
import SelfkeyIdApplications from '../components/selfkey-id-applications';
import { kycSelectors } from '../../../../common/kyc';

class SelfkeyIdApplicationsContainerComponent extends Component {
	state = {
		showApplicationRefreshModal: false
	};

	async componentDidMount() {
		const { vendors } = this.props;

		await this.props.dispatch(kycOperations.resetApplications());
		// load marketplace store
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
		// load existing kyc_applications data
		await this.props.dispatch(kycOperations.loadApplicationsOperation());

		await this.loadRelyingParties(vendors);
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.vendors.length !== this.props.vendors.length) {
			await this.loadRelyingParties(this.props.vendors);
		}
	}

	async loadRelyingParties(vendors) {
		const authenticated = true;
		const { afterAuthRoute, cancelRoute } = this.props;

		for (const vendor of vendors) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty(
					vendor.vendorId,
					authenticated,
					afterAuthRoute,
					cancelRoute
				)
			);
		}
	}

	handleApplicationAdditionalRequirements = application => {
		const { rps } = this.props;

		// get current application info from RP
		const rp = rps[application.rpName];
		if (!rp) {
			console.warning(`Can't find RP named ${application.rpName}`);
			return false;
		}
		// Later on, we will need to improve this to be able to distinguish requirements
		// that can be fulfilled by the wallet directly and ones that need redirect to KYCC
		// onboarding app.
		// Redirects to KYCC with auto-login via JWT token
		const instanceUrl = rp.session.ctx.config.rootEndpoint;
		const url = `${instanceUrl}/applications/${application.id}?access_token=${
			rp.session.access_token.jwt
		}`;
		window.openExternal(null, url);
	};

	handleApplicationRefresh = application => {
		const { rps } = this.props;

		// get current application info from RP
		const rp = rps[application.rpName];
		if (!rp) {
			console.warning(`Can't find RP named ${application.rpName}`);
			return false;
		}

		console.log(rp);

		const kycApplication = rp.applications.find(app => app.id === application.id);

		if (application && kycApplication) {
			// update stored application
			application.currentStatus = kycApplication.currentStatus;
			application.currentStatusName = kycApplication.statusName;
			application.updatedAt = kycApplication.updatedAt;
		}

		// sync of RP applications with local database is done automatically, all done, show modal
		this.setState({
			showApplicationRefreshModal: true
		});
	};

	handleCloseApplicationRefreshModal = evt => {
		evt && evt.preventDefault();
		this.setState({ showApplicationRefreshModal: false });
	};

	render() {
		const { rps, vendors } = this.props;
		const loading = Object.keys(rps).length === 0 || vendors.length === 0;
		return (
			<SelfkeyIdApplications
				{...this.props}
				loading={loading}
				showApplicationRefreshModal={this.state.showApplicationRefreshModal}
				onCloseApplicationRefreshModal={this.handleCloseApplicationRefreshModal}
				onApplicationRefresh={this.handleApplicationRefresh}
				onApplicationAdditionalRequirements={this.handleApplicationAdditionalRequirements}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const walletType = appSelectors.selectApp(state).walletType;

	return {
		wallet: walletSelectors.getWallet(state),
		orders: marketplaceSelectors.getAllOrders(state),
		vendors: marketplaceSelectors.selectActiveVendors(state),
		rps: kycSelectors.relyingPartiesSelector(state),
		applications: kycSelectors.selectApplications(state),
		afterAuthRoute:
			walletType === 'ledger' || walletType === 'trezor' ? `/main/selfkeyIdApplications` : '',
		cancelRoute: `/main/selfkeyId`
	};
};

export const SelfkeyIdApplicationsContainer = connect(mapStateToProps)(
	SelfkeyIdApplicationsContainerComponent
);

export default SelfkeyIdApplicationsContainer;
