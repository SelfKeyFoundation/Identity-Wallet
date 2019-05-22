import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Popup, Accordion, Alert, AlertIcon } from '../src/renderer/common';

const data = {
	basic: {
		name: 'Option 1',
		minBalance: 'SDG 2,000',
		visitRequired: 'no'
	},
	account: {
		type: 'SGD 15,000',
		currencies: ['Usd', 'sGd', 'EUR'],
		minDeposit: 'SDG 2,000',
		cards: ['visa', 'mastercard'],
		onlineBanking: ['Usd', 'sGd', 'EUR'],
		goodFor: 'saving'
	},
	accountOpening: {
		visitRequired: 'yes',
		timeToOpen: '12'
	},
	eligibility: [
		'Individuals resident or nationals from high-risk jurisdictions are not eligible. US individuals are eligible but the account will be restricted to cash management, FOREX, and term-deposits.',
		'Maintain an Average Quarterly Balance (AQB) of SGD 15,000 or more in a combination of savings account, current account and fixed deposit balances, OR',
		'Hold a Corporate Salary Account under the Corporate Employee Programme (CEP) with monthly salary credits into this account1, OR',
		'Have a mortgage relationship with the bank, with equated monthly instalments (EMI) being debited from this account towards the mortgage loan repayment with the bank'
	],
	extraKYCRequirements: {
		text:
			'Bank Specific KYC Requirements might apply. If this is the case you will be asked for additional documents tp fill, after the basic KYC information and documents have been validated.'
	},
	alert: {
		type: 'warning',
		text:
			'Please make sure you understand the bank requirements and that you are able/willing to fulfill them before placing your order.'
	}
};

storiesOf('Common/Accordion', module).add('Option', () => (
	<div style={{ width: '1140px' }}>
		<Accordion data={data} open={true} />
	</div>
));

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
