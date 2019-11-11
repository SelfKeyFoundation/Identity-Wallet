import React, { PureComponent } from 'react';
import Toolbar from './toolbar';
import config from 'common/config';
import { connect } from 'react-redux';
import { memoizedIdentitySelectors, identityOperations } from 'common/identity';
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
		this.props.dispatch(push('/main/create-corporate-profile'));
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

export default connect(state => ({
	profiles: memoizedIdentitySelectors.selectIdentities(state) || [],
	selectedProfile: memoizedIdentitySelectors.selectIdentity(state) || {},
	wallet: walletSelectors.getWallet(state)
}))(ToolbarContainer);
