import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { SelfkeyDarkTheme } from 'selfkey-ui';

addDecorator(storyFn => (
	<SelfkeyDarkTheme>
		<div style={{ width: '1450px', padding: '20px' }}>{storyFn()}</div>
	</SelfkeyDarkTheme>
));

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.jsx?$/);
function loadStories() {
	req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
