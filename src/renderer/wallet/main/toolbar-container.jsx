import React, { PureComponent } from 'react';
import Toolbar from './toolbar';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import { appSelectors, appOperations } from 'common/app';
import { walletSelectors } from 'common/wallet';
import { push } from 'connected-react-router';
import { featureIsEnabled } from 'common/feature-flags';

class ToolbarContainer extends PureComponent {
	state = {
		isSidebarOpen: false,
		isProfileOpen: false,
		isChainsOpen: false
	};

	toggleDrawer = isSidebarOpen => {
		this.setState({
			isSidebarOpen
		});
	};

	closeProfile = isProfileOpen => {
		this.setState({
			isProfileOpen: false
		});
	};

	toggleProfile = isProfileOpen => {
		this.setState({
			isProfileOpen
		});
	};

	createCorporateProfile = evt => {
		this.toggleProfile(!this.state.isProfileOpen);
		this.props.dispatch(push('/main/corporate/create-corporate-profile'));
	};

	handleProfileSelect = identity => evt => {
		evt.preventDefault();
		this.toggleProfile(!this.state.isProfileOpen);
		this.props.dispatch(identityOperations.switchProfileOperation(identity));
	};

	handleProfileNavigate = evt => {
		evt.preventDefault();
		this.props.dispatch(identityOperations.navigateToProfileOperation());
	};

	handleProfileClick = evt => {
		evt && evt.stopPropagation();
		this.toggleProfile(!this.state.isProfileOpen);
	};

	handleChainsClick = evt => {
		evt && evt.stopPropagation();
		this.setState(prevState => ({ isChainsOpen: !prevState.isChainsOpen }));
	};

	handleChainSelect = chainId => {
		if (this.props.availableChains[chainId]) {
			this.props.dispatch(appOperations.setChainOperation(chainId));
			this.closeChainsDropDown();
		}
	};

	closeChainsDropDown = () => {
		// evt && evt.stopPropagation();
		this.setState({ isChainsOpen: false });
	};

	onClickNewChain = evt => {};

	render() {
		const { isProfileOpen, isSidebarOpen, isChainsOpen } = this.state;
		return (
			<Toolbar
				isSidebarOpen={isSidebarOpen}
				isProfileOpen={isProfileOpen}
				isChainsOpen={isChainsOpen}
				profiles={this.props.profiles}
				profileNames={this.props.profileNames}
				selectedProfile={this.props.selectedProfile}
				wallet={this.props.wallet}
				primaryToken={this.props.selectedChain.primaryToken}
				rewardToken={this.props.selectedChain.rewardToken}
				chains={this.props.availableChains}
				selectedChain={this.props.selectedChain}
				onProfileClick={this.handleProfileClick}
				onProfileSelect={this.handleProfileSelect}
				onCreateCorporateProfileClick={this.createCorporateProfile}
				onToggleMenu={this.toggleDrawer}
				closeProfile={this.closeProfile}
				onProfileNavigate={this.handleProfileNavigate}
				showCorporate={featureIsEnabled('corporate')}
				showStaking={featureIsEnabled('staking')}
				isExportableAccount={this.props.isExportableAccount}
				onChainsClick={this.handleChainsClick}
				onChainSelect={this.handleChainSelect}
				onCloseChainsDropDown={this.closeChainsDropDown}
				onClickNewChain={this.handleNewChainClick}
			/>
		);
	}
}

const defaultIdentityName = ({ type }, walletName) =>
	type === 'individual' ? walletName || 'New individual' : 'New company';

export default connect(state => {
	const profiles = identitySelectors.selectIdentities(state) || [];
	const wallet = walletSelectors.getWallet(state);
	const profileNames = profiles.reduce(
		(acc, curr) => {
			let name = curr.name || defaultIdentityName(curr, wallet.profileName);
			acc.byName[name] = (acc.byName[name] || 0) + 1;
			let profileName = name;
			if (acc.byName[name] > 1) {
				profileName = `${name} (${acc.byName[name]})`;
			}
			acc.byId[curr.id] = profileName;
			return acc;
		},
		{ byId: {}, byName: {} }
	);
	return {
		profiles,
		profileNames: profileNames.byId,
		selectedProfile: identitySelectors.selectIdentity(state) || {},
		wallet,
		isExportableAccount: appSelectors.selectCanExportWallet(state),
		selectedChain: appSelectors.selectChain(state),
		availableChains: appSelectors.selectAvailableChains(state)
	};
})(ToolbarContainer);
