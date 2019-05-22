import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Popup, Alert, AlertIcon } from '../src/renderer/common';

storiesOf('Common/Popup', module).add('default', () => (
	<Popup closeAction={action('popup close action click')} open text="Test Popup">
		Storybook popup content
	</Popup>
));

storiesOf('Common/AlertIcon', module)
	.add('default', () => <AlertIcon />)
	.add('success', () => <AlertIcon type="success" />)
	.add('warning', () => <AlertIcon type="warning" />)
	.add('danger', () => <AlertIcon type="danger" />)
	.add('info', () => <AlertIcon type="info" />);

storiesOf('Common/Alert', module)
	.add('default', () => <Alert>Hello</Alert>)
	.add('success', () => <Alert type="success">Hello</Alert>)
	.add('warning', () => (
		<Alert type="warning">
			Please make sure you understand the bank requirements and that you are able/willing to
			fulfill them before placing your order.
		</Alert>
	))
	.add('danger', () => <Alert type="danger">Hello</Alert>)
	.add('info', () => <Alert type="info">Hello</Alert>);
