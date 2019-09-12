import React from 'react';
import { storiesOf } from '@storybook/react';
import SidebarSwitchAccount from '../src/renderer/wallet/main/sidebar-switch-account';
import { action } from '@storybook/addon-actions';
import Toolbar from '../src/renderer/wallet/main/toolbar';

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

storiesOf('Sidebars/Toolbar', module)
	.add('default', () => (
		<Toolbar
			profiles={profiles}
			selectedProfile={profiles[0]}
			primaryToken="KEY"
			isSidebarOpen={false}
			isProfileOpen={false}
			onToggleMenu={action('onToggleMenu')}
			onProfileClick={action('onProfileClick')}
			onCreateCorporateProfileClick={action('onCreateCorporateProfileClick')}
		/>
	))
	.add('SidebarOpen', () => (
		<Toolbar
			profiles={profiles}
			selectedProfile={profiles[0]}
			primaryToken="KEY"
			isSidebarOpen={true}
			isProfileOpen={false}
			onToggleMenu={action('onToggleMenu')}
			onProfileClick={action('onProfileClick')}
			onCreateCorporateProfileClick={action('onCreateCorporateProfileClick')}
		/>
	))
	.add('ProfileOpen', () => (
		<Toolbar
			profiles={profiles}
			selectedProfile={profiles[0]}
			primaryToken="KEY"
			isSidebarOpen={false}
			isProfileOpen={true}
			onToggleMenu={action('onToggleMenu')}
			onProfileClick={action('onProfileClick')}
			onCreateCorporateProfileClick={action('onCreateCorporateProfileClick')}
		/>
	));

storiesOf('Sidebars', module).add('CORP Sidebar Switch Account', () => (
	<SidebarSwitchAccount isOpen={true} />
));
