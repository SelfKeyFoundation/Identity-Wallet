import React, { PureComponent } from 'react';
import Toolbar from './toolbar';
import config from 'common/config';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import { walletSelectors } from 'common/wallet';
import { push } from 'connected-react-router';
import { featureIsEnabled } from 'common/feature-flags';

class ToolbarContainer extends PureComponent {
	state = {
		isSidebarOpen: false,
		isProfileOpen: false
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
	render() {
		const { isProfileOpen, isSidebarOpen } = this.state;
		return (
			<Toolbar
				isSidebarOpen={isSidebarOpen}
				isProfileOpen={isProfileOpen}
				profiles={this.props.profiles}
				profileNames={this.props.profileNames}
				selectedProfile={this.props.selectedProfile}
				wallet={this.props.wallet}
				onProfileClick={this.handleProfileClick}
				onProfileSelect={this.handleProfileSelect}
				onCreateCorporateProfileClick={this.createCorporateProfile}
				onToggleMenu={this.toggleDrawer}
				primaryToken={config.constants.primaryToken}
				closeProfile={this.closeProfile}
				onProfileNavigate={this.handleProfileNavigate}
				showCorporate={featureIsEnabled('corporate')}
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
		wallet
	};
})(ToolbarContainer);
