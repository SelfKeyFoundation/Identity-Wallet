import React from 'react';
import { storiesOf } from '@storybook/react';
import AutoUpdate from '../src/renderer/auto-update/auto-update';
import AutoUpdateProgress from '../src/renderer/auto-update/auto-update-progress';

const info = {
	releaseName: '1.0.1-beta',
	releaseDate: 'April 08, 2020',
	releaseNotes: '<ul>\n<li>UX fixes</li>\n<li>Bug fixes</li>\n</ul>'
};

const progress = {
	percent: 50
};

storiesOf('AutoUpdate', module)
	.add('AutoUpdate', () => <AutoUpdate info={info} />)
	.add('AutoUpdateProgress', () => <AutoUpdateProgress progress={progress} />);
