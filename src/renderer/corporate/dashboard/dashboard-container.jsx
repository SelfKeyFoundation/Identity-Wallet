import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { identityOperations, identitySelectors } from 'common/identity';
import { marketplaceSelectors, marketplaceOperations } from 'common/marketplace';
import { CorporateDashboardPage } from './dashboard-page';
import { RegisterDidCardContainer } from '../../did';
import { kycSelectors, kycOperations } from 'common/kyc';
import { appSelectors } from 'common/app';
import { walletSelectors } from 'common/wallet';
import {
	CreateAttributeContainer,
	EditAttributeContainer,
	DeleteAttributeContainer
} from '../../attributes';
import DeleteMemberContainer from '../../attributes/delete-member-container';
import { featureIsEnabled } from 'common/feature-flags';

class CorporateDashboardContainer extends PureComponent {
	state = {
		popup: null,
		member: null,
		selectedMember: false
	};

	async componentDidMount() {
		const { vendors, dispatch, wallet, afterAuthRoute, cancelRoute } = this.props;
		// load marketplace store
		dispatch(marketplaceOperations.loadMarketplaceOperation());

		// await dispatch(kycOperations.resetApplications());
		// load existing kyc_applications data
		await dispatch(kycOperations.loadApplicationsOperation());

		// load RPs
		if (wallet.profile === 'local') {
			await dispatch(
				kycOperations.loadRelyingPartiesForVendors(
					vendors,
					afterAuthRoute,
					cancelRoute,
					true,
					true
				)
			);
		}
		window.scrollTo(0, 0);
	}

	componentDidUpdate(prevProps) {
		const { wallet, vendors, afterAuthRoute, cancelRoute, dispatch } = this.props;

		if (prevProps.vendors.length !== vendors.length && wallet.profile === 'local') {
			return dispatch(
				kycOperations.loadRelyingPartiesForVendors(
					vendors,
					afterAuthRoute,
					cancelRoute,
					true
				)
			);
		}
	}

	handleAddMember = () => this.props.dispatch(push('/main/corporate/add-member'));

	handleDeleteMember = member => {
		this.setState({ popup: 'delete-member', deleteMember: member });
	};

	handleEditMember = member => {
		const { identity } = this.props.profile;
		this.props.dispatch(
			push(`/main/corporate/edit-member/${identity.id}/${member.identity.id}`)
		);
	};

	handleOpenDetails = member => {
		if (
			this.state.selectedMember &&
			this.state.selectedMember.identity.id === member.identity.id
		) {
			this.setState({ selectedMember: false });
		} else {
			this.setState({ selectedMember: member });
		}
	};

	handleAttributeDelete = attributeId =>
		this.props.dispatch(identityOperations.removeIdAttributeOperation(attributeId));

	handleEditAttribute = attribute => {
		this.setState({ popup: 'edit-attribute', editAttribute: attribute });
	};
	handleAddAttribute = (evt, member) => {
		this.setState({ popup: 'create-attribute', isDocument: false, member });
	};
	handleAddDocument = (evt, member) => {
		this.setState({ popup: 'create-attribute', isDocument: true, member });
	};
	handleDeleteAttribute = attribute => {
		this.setState({ popup: 'delete-attribute', deleteAttribute: attribute });
	};
	handlePopupClose = () => {
		this.setState({ popup: null, member: null });
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
		const { popup, member, editAttribute, deleteAttribute } = this.state;
		return (
			<React.Fragment>
				{popup === 'create-attribute' && (
					<CreateAttributeContainer
						corporate={member ? member.identity.type === 'corporate' : true}
						open={true}
						onClose={this.handlePopupClose}
						isDocument={this.state.isDocument}
						attributeOptions={
							member ? member.attributeOptions : this.props.profile.attributeOptions
						}
						identityId={member ? member.identity.id : this.props.profile.identity.id}
					/>
				)}
				{popup === 'edit-attribute' && (
					<EditAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						attribute={editAttribute}
					/>
				)}
				{popup === 'delete-attribute' && (
					<DeleteAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						attribute={deleteAttribute}
					/>
				)}
				{popup === 'delete-member' && (
					<DeleteMemberContainer
						open={true}
						onClose={this.handlePopupClose}
						member={this.state.deleteMember}
					/>
				)}

				<CorporateDashboardPage
					{...this.props}
					tab={this.props.match.params.tab}
					attributes={[...profile.basicAttributes, ...profile.attributes]}
					attributeOptions={profile.attributeOptions}
					documents={profile.documents}
					onAddAttribute={this.handleAddAttribute}
					onEditAttribute={this.handleEditAttribute}
					onDeleteAttribute={this.handleDeleteAttribute}
					onAddDocument={this.handleAddDocument}
					onEditDocument={this.handleEditAttribute}
					onDeleteDocument={this.handleDeleteAttribute}
					onAddMember={this.handleAddMember}
					onDeleteMember={this.handleDeleteMember}
					onEditMember={this.handleEditMember}
					onOpenMemberDetails={this.handleOpenDetails}
					selectedMember={this.state.selectedMember}
					didComponent={
						featureIsEnabled('did') ? (
							<RegisterDidCardContainer returnPath={'/main/corporate'} />
						) : null
					}
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
	const profile = identitySelectors.selectCorporateProfile(state);
	const walletType = appSelectors.selectApp(state).walletType;
	return {
		profile,
		walletType,
		wallet: walletSelectors.getWallet(state),
		members: identitySelectors.selectFlattenMemberHierarchy(state, {
			identityId: profile.identity.id
		}),
		rps: kycSelectors.relyingPartiesSelector(state),
		vendors: marketplaceSelectors.selectActiveVendors(state),
		applications: kycSelectors.selectApplications(state),
		applicationsProcessing: kycSelectors.selectProcessing(state),
		afterAuthRoute:
			walletType === 'ledger' || walletType === 'trezor'
				? `/main/corporate/dashboard/applications`
				: '',
		cancelRoute: `/main/corporate`
	};
};

const connectedComponent = connect(mapStateToProps)(CorporateDashboardContainer);
export { connectedComponent as CorporateDashboardContainer };
