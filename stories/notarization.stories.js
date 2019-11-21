import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import NotarizationDetailsPage from '../src/renderer/marketplace/notarization/details/notarization-details-page';
import RequestNotarizationPage from '../src/renderer/marketplace/notarization/process/request-notarization-page';
import TOCPopup from '../src/renderer/marketplace/notarization/common/toc-popup';
import TOCDisagreementPopup from '../src/renderer/marketplace/notarization/common/toc-disagreement-popup';
import RequirePayment from '../src/renderer/certifiers/common/require-payment-popup';

const documents = [
	{
		id: '8xhdgd',
		type: {
			content: {
				title: 'National ID'
			}
		},
		name: 'My special National ID doc',
		data: {
			value: {
				expires: 1569504593
			}
		},
		documents: [
			{
				name: '1st file name.pdf',
				fileName: 'finame?',
				mimeType: 'application/pdf'
			}
		]
	},
	{
		id: 'lklj9po',
		type: {
			content: {
				title: 'Passport'
			}
		},
		name: 'Utlevel - Passport',
		data: {
			value: {
				expires: 1299904593000
			}
		},
		documents: [
			{
				name: 'FH_Passport.jpg',
				mimeType: 'image/jpeg'
			}
		]
	}
];

storiesOf('Notarization/Tabs', module)
	.add('types', () => (
		<NotarizationDetailsPage
			tab="types"
			keyRate="0.0001297225"
			onTabChange={linkTo('Notarization/Tabs', tab => tab)}
			startNotarize={linkTo('Notarization', 'Request Notarization')}
		/>
	))
	.add('informations', () => (
		<NotarizationDetailsPage
			tab="informations"
			keyRate="0.0001297225"
			onTabChange={linkTo('Notarization/Tabs', tab => tab)}
			startNotarize={linkTo('Notarization', 'Request Notarization')}
		/>
	));

storiesOf('Notarization/Popups', module)
	.add('toc', () => (
		<TOCPopup
			onBackClick={linkTo('Notarization', 'Request Notarization')}
			onDisagreeClick={linkTo('Notarization/Popups', 'toc disagreement')}
		/>
	))
	.add('toc disagreement', () => (
		<TOCDisagreementPopup
			onBackClick={linkTo('Notarization', 'Request Notarization')}
			onReturnClick={linkTo('Notarization/Popups', 'toc')}
		/>
	))
	.add('require payment', () => (
		<RequirePayment name={'John Doe'} address={'0x4ac0d9ebd28118cab68a64ad8eb8c07c0120ebf8'} />
	));

storiesOf('Notarization', module).add('Request Notarization', () => (
	<RequestNotarizationPage
		documents={documents}
		onBackClick={linkTo('Notarization/Tabs', 'types')}
		onStartClick={linkTo('Notarization/Popups', 'toc')}
	/>
));
