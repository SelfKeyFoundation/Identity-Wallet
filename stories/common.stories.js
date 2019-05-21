import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Popup } from '../src/renderer/common';

storiesOf('Common', module).add('Popup', () => (
	<Popup closeAction={action('popup close action click')} open text="Test Popup">
		Storybook popup content
	</Popup>
));
