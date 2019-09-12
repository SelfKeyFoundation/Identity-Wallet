import React, { Component } from 'react';
import Toolbar from './toolbar';
import config from 'common/config';

const profiles = [
	{
		id: 1,
		name: 'James Bond',
		type: 'individual'
	},
	{
		id: 2,
		name: 'Acme Corp',
		type: 'corporate'
	},
	{
		id: 3,
		name: 'Standard United Bank',
		type: 'corporate'
	}
];

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
				profiles={profiles}
				selectedProfile={profiles[0]}
				onProfileClick={this.handleProfileClick}
				onCreateCorporateProfileClick={this.createCorporateProfile}
				onToggleMenu={this.toggleDrawer}
				primaryToken={config.constants.primaryToken}
			/>
		);
	}
}

export default ToolbarContainer;
