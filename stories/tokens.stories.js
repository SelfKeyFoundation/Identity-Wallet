import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { TokenSelector } from '../src/renderer/tokens/token-selector';
import { tokens } from './__fixtures__/token-data';
storiesOf('Tokens', module).add('TokenSelector', () => {
	const [selected, setSelected] = useState();

	const handleTokenChange = token => {
		setSelected(token ? token.symbol : token);
	};

	return (
		<div style={{ maxWidth: 300 }}>
			<TokenSelector selected={selected} onTokenChange={handleTokenChange} tokens={tokens} />
		</div>
	);
});
