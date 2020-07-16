import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { withKnobs } from '@storybook/addon-knobs';
import { SelfkeyDarkTheme } from 'selfkey-ui';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { withA11y } from '@storybook/addon-a11y';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import dummyState from './store-data.json';

setConsoleOptions({
	panelExclude: []
});

const configureStore = () => createStore((state = dummyState) => state);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(jsxDecorator);
addDecorator(withKnobs);
addDecorator(withA11y);

addDecorator(storyFn => {
	const store = configureStore();
	return (
		<SelfkeyDarkTheme>
			<Provider store={store}>
				<MemoryRouter>
					<div style={{ width: '1450px', padding: '20px' }}>{storyFn()}</div>
				</MemoryRouter>
			</Provider>
		</SelfkeyDarkTheme>
	);
});

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.jsx?$/);
function loadStories() {
	req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
