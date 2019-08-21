import React from 'react';
import { storiesOf } from '@storybook/react';
import SidebarSwitchAccount from '../src/renderer/wallet/main/sidebar-switch-account';

storiesOf('Sidebars', module).add('CORP Sidebar Switch Account', () => (
	<SidebarSwitchAccount isOpen={true} />
));
