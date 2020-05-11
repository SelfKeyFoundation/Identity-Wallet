import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import { push } from 'connected-react-router';
import { appSelectors } from 'common/app';
import { walletSelectors } from 'common/wallet';
import { marketplaceSelectors, marketplaceOperations } from 'common/marketplace';
import { kycSelectors, kycOperations } from 'common/kyc';
import { RegisterDidCardContainer } from 'renderer/did';
import { IndividualDashboardPage } from './dashboard-page';
import { NotifyPopup } from '../common/notify-popup';
import {
	CreateAttributeContainer,
	EditAttributeContainer,
	DeleteAttributeContainer,
	EditAvatarContainer
} from '../../attributes';

const MARKETPLACE_ROOT_PATH = '/main/marketplace';

class IndividualDashboardContainerComponent extends PureComponent {
	state = {
		popup: null
	};

	async componentDidMount() {
		const { vendors, profile, dispatch, wallet } = this.props;
		const { identity } = profile;

		if (!identity.isSetupFinished) {
			return dispatch(push('/selfkeyIdForm'));
			// TODO: later refactor to individual profile folder
			// return dispatch(push('/main/individual/setup-individual-profile'));
		}

		// load marketplace store
		dispatch(marketplaceOperations.loadMarketplaceOperation());

		await dispatch(kycOperations.resetApplications());
		// load existing kyc_applications data
		await dispatch(kycOperations.loadApplicationsOperation());

		// load RPs
		if (wallet.profile === 'local') {
			await this.loadRelyingParties(vendors);
		}
		window.scrollTo(0, 0);
	}

	componentDidUpdate(prevProps) {
		const { wallet, vendors } = this.props;

		if (prevProps.vendors.length !== vendors.length && wallet.profile === 'local') {
			return this.loadRelyingParties(vendors);
		}
	}

	async loadRelyingParties(vendors) {
		const authenticated = true;
		const { afterAuthRoute, cancelRoute, dispatch } = this.props;
		const loadInBackground = true;
		for (const vendor of vendors) {
			await dispatch(
				kycOperations.loadRelyingParty(
					vendor.vendorId,
					authenticated,
					afterAuthRoute,
					cancelRoute,
					loadInBackground
				)
			);
		}
	}

	handleMarketplaceClick = () => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));

	handleAttributeDelete = attributeId =>
		this.props.dispatch(identityOperations.removeIdAttributeOperation(attributeId));

	handleEditAttribute = attribute => {
		this.setState({ popup: 'edit-attribute', editAttribute: attribute });
	};
	handleAddAttribute = evt => {
		this.setState({ popup: 'create-attribute', isDocument: false });
	};
	handleAddDocument = evt => {
		this.setState({ popup: 'create-attribute', isDocument: true });
	};
	handleDeleteAttribute = attribute => {
		this.setState({ popup: 'delete-attribute', deleteAttribute: attribute });
	};
	handleEditAvatar = () => {
		this.setState({ popup: 'edit-avatar' });
	};
	handlePopupClose = () => {
		this.setState({ popup: null });
	};

	handleApplicationAdditionalRequirements = application => {
		const { rps } = this.props;

		// get current application info from RP
		const rp = rps[application.rpName];
		if (!rp) {
			console.error(`Can't find RP named ${application.rpName}`);
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
		const { rps, wallet, dispatch, afterAuthRoute, cancelRoute } = this.props;

		// get current application info from RP
		const rp = rps[application.rpName];
		if (!rp && wallet.profile === 'local') {
			console.warn(`Can't find RP named ${application.rpName}`);
			return false;
		}

		if (wallet.profile !== 'local') {
			return dispatch(
				kycOperations.refreshRelyingPartyForKycApplication(
					application,
					afterAuthRoute,
					cancelRoute
				)
			);
		}

		if (rp.error) {
			console.warn(`RP loading error`, rp);
			this.setState({ popup: 'applications-refresh' });
			return false;
		}

		// sync of RP applications with local database is done automatically, all done, show modal
		this.setState({ popup: 'applications-refresh' });
		return dispatch(kycOperations.loadRelyingParty(application.rpName, true));
	};

	render() {
		const { profile } = this.props;
		const { popup } = this.state;
		return (
			<React.Fragment>
				{popup === 'create-attribute' && (
					<CreateAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						isDocument={this.state.isDocument}
					/>
				)}
				{popup === 'edit-attribute' && (
					<EditAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.editAttribute}
					/>
				)}
				{popup === 'delete-attribute' && (
					<DeleteAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.deleteAttribute}
					/>
				)}
				{popup === 'edit-avatar' && (
					<EditAvatarContainer
						open={true}
						onClose={this.handlePopupClose}
						avatar={profile.profilePicture}
						identityId={profile.identity.id}
					/>
				)}
				{popup === 'applications-refresh' && (
					<NotifyPopup
						onClose={this.handlePopupClose}
						title="Update Application"
						text="Application status updated successfully."
					/>
				)}

				<IndividualDashboardPage
					{...this.props}
					onMarketplaceClick={this.handleMarketplaceClick}
					onAddAttribute={this.handleAddAttribute}
					onEditAttribute={this.handleEditAttribute}
					onDeleteAttribute={this.handleDeleteAttribute}
					onAddDocument={this.handleAddDocument}
					onEditDocument={this.handleEditAttribute}
					onDeleteDocument={this.handleDeleteAttribute}
					onAvatarClick={this.handleEditAvatar}
					didComponent={<RegisterDidCardContainer returnPath={'/main/individual'} />}
					onApplicationAdditionalRequirements={
						this.handleApplicationAdditionalRequirements
					}
					onApplicationRefresh={this.handleApplicationRefresh}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	const walletType = appSelectors.selectApp(state).walletType;
	return {
		wallet: walletSelectors.getWallet(state),
		walletType,
		profile: identitySelectors.selectIndividualProfile(state),
		vendors: marketplaceSelectors.selectActiveVendors(state),
		rps: kycSelectors.relyingPartiesSelector(state),
		applications: kycSelectors.selectApplications(state),
		afterAuthRoute:
			walletType === 'ledger' || walletType === 'trezor'
				? `/main/individual/dashboard/applications`
				: '',
		cancelRoute: `/main/individual`
	};
};

export const IndividualDashboardContainer = connect(mapStateToProps)(
	IndividualDashboardContainerComponent
);

export default IndividualDashboardContainer;
