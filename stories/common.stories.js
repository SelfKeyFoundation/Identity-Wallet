import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import {
	Popup,
	Accordion,
	Alert,
	AlertIcon,
	AttributesTable,
	TransactionErrorPopup,
	TransactionProcessingPopup,
	Scrollable
} from '../src/renderer/common';
import { text, boolean, object, select } from '@storybook/addon-knobs';
import AccentedCard from '../src/renderer/common/accented-card';
import { CardContent } from '@material-ui/core';
import { primary } from 'selfkey-ui';

import vaultImage from '../static/assets/images/bgs/vault.png';

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

storiesOf('Common/Scrollable', module).add('default', () => (
	<div style={{ width: '1140px' }}>
		<Scrollable
			style={object('styles', {
				maxHeight: '100px',
				width: '100px',
				color: 'white'
			})}
		>
			{text(
				'text',
				'Bank Specific KYC Requirements might apply. If this is the case you will be asked for additional documents tp fill, after the basic KYC information and documents have been validated.'
			)}
		</Scrollable>
	</div>
));

storiesOf('Common/Accordion', module).add('Option', () => (
	<div style={{ width: '1140px' }}>
		<Accordion data={object('accordion-data', data)} open={boolean('is open', true)} />
	</div>
));

storiesOf('Common/Popup', module).add('default', () => (
	<Popup
		closeAction={action(text('close action text', 'popup close action click'))}
		open={boolean('is popup open', true)}
		text={text('Title Text', 'Test Popup')}
	>
		{text('Popup content', 'Storybook popup content')}
	</Popup>
));

const alertSelects = [undefined, 'success', 'warning', 'danger', 'info'];

storiesOf('Common/AlertIcon', module)
	.add('default', () => <AlertIcon type={select('Alert Selects', alertSelects, undefined)} />)
	.add('success', () => <AlertIcon type={select('Alert Selects', alertSelects, 'success')} />)
	.add('warning', () => <AlertIcon type={select('Alert Selects', alertSelects, 'warning')} />)
	.add('danger', () => <AlertIcon type={select('Alert Selects', alertSelects, 'danger')} />)
	.add('info', () => <AlertIcon type={select('Alert Selects', alertSelects, 'info')} />);

storiesOf('Common/Alert', module)
	.add('default', () => (
		<Alert type={select('Alert Selects', alertSelects, undefined)}>
			{text('Alert text', 'default')}
		</Alert>
	))
	.add('success', () => (
		<Alert type={select('Alert Selects', alertSelects, 'success')}>
			{text('Alert text', 'Success')}
		</Alert>
	))
	.add('warning', () => (
		<Alert type={select('Alert Selects', alertSelects, 'warning')}>
			{text(
				'Alert text',
				'Please make sure you understand the bank requirements and that you are able/willing to fulfill them before placing your order.'
			)}
		</Alert>
	))
	.add('danger', () => (
		<Alert type={select('Alert Selects', alertSelects, 'danger')}>
			{text('Alert text', 'Danger !')}
		</Alert>
	))
	.add('info', () => (
		<Alert type={select('Alert Selects', alertSelects, 'info')}>
			{text('Alert text', 'Info !')}
		</Alert>
	));

storiesOf('Common', module)
	.add('AttributesTable', () => (
		<div style={{ width: '450px', height: '450px' }}>
			<AttributesTable
				title={text('Title', 'Test Table')}
				attributes={object('Attributes', [
					{ name: 'Test Attribute 1', value: 'Test value 1' },
					{ name: 'Test Attribute 2', value: 'Test value 2' },
					{ name: 'Test Attribute 3', value: 'Test value 3' },
					{ name: 'Test Attribute 4', value: 'Test value 4' },
					{ name: 'Test Attribute 5', value: 'Test value 5' },
					{ name: 'Test Attribute 6', value: 'Test value 6' }
				])}
			/>
		</div>
	))
	.add('TransactionProcessingPopup', () => (
		<TransactionProcessingPopup title={text('Title', 'Processing')} />
	))
	.add('TransactionErrorPopup', () => <TransactionErrorPopup title={text('Title', 'Error')} />);

storiesOf('Common/AccentedCard', module)
	.add('default', () => (
		<AccentedCard>
			<CardContent>hi</CardContent>
		</AccentedCard>
	))
	.add('elevated', () => (
		<AccentedCard elevation={5}>
			<CardContent>hi</CardContent>
		</AccentedCard>
	))
	.add('accented', () => (
		<AccentedCard elevation={5} accentColor={primary}>
			<CardContent>hi</CardContent>
		</AccentedCard>
	))
	.add('gradient background', () => (
		<AccentedCard elevation={5} accentColor={primary} gradient>
			<CardContent>hi</CardContent>
		</AccentedCard>
	))
	.add('image background', () => (
		<AccentedCard
			style={{ width: 257, height: 437 }}
			elevation={5}
			accentColor={primary}
			gradient
			backgroundImage={{ img: vaultImage }}
		>
			<CardContent>hi</CardContent>
		</AccentedCard>
	));
