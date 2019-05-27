import React from 'react';
import { storiesOf } from '@storybook/react';
import AutoUpdate from '../src/renderer/auto-update/auto-update';
import AutoUpdateProgress from '../src/renderer/auto-update/auto-update-progress';

const info = {
	releaseName: '1.0.1-beta',
	releaseNotes:
		'<h2>SelfKey Identity Wallet Version 1.0.1-beta</h2>\n<ul>\n<li>Release Date: April 08, 2019</li>\n</ul>\n<h2>Improvements:</h2>\n<ul>\n<li>UX fixes</li>\n<li>Bug fixes</li>\n</ul>'
};

const progress = {
	percent: 50
};

storiesOf('AutoUpdate', module)
	.add('AutoUpdate', () => <AutoUpdate info={info} />)
	.add('AutoUpdateProgress', () => <AutoUpdateProgress progress={progress} />);
