import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { SelfkeyDarkTheme } from 'selfkey-ui';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import dummyState from './store-data.json';

const configureStore = () => createStore((state = dummyState) => state);

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
