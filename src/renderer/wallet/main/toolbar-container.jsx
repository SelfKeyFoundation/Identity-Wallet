import React, { Component } from 'react';
import Toolbar from './toolbar';
import config from 'common/config';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import { push } from 'connected-react-router';

class ToolbarContainer extends Component {
	state = {
		isSidebarOpen: false,
		isProfileOpen: false
	};

	toggleDrawer = isSidebarOpen => {
		this.setState({
			isSidebarOpen
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

	handleProfileClick = evt => {
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
				onProfileClick={this.handleProfileClick}
				onProfileSelect={this.handleProfileSelect}
				onCreateCorporateProfileClick={this.createCorporateProfile}
				onToggleMenu={this.toggleDrawer}
				primaryToken={config.constants.primaryToken}
			/>
		);
	}
}

export default connect(state => ({
	profiles: identitySelectors.selectAllIdentities(state) || [],
	selectedProfile: identitySelectors.selectCurrentIdentity(state) || {}
}))(ToolbarContainer);
