import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import NotarizationDetailsPage from '../src/renderer/marketplace/notarization/details/notarization-details-page';
import RequestNotarizationPage from '../src/renderer/marketplace/notarization/process/request-notarization-page';
import TOCPopup from '../src/renderer/marketplace/notarization/common/toc-popup';
import TOCDisagreementPopup from '../src/renderer/marketplace/notarization/common/toc-disagreement-popup';
import NotarizationMessageWidget from '../src/renderer/marketplace/notarization/common/message-widget';
import KYCRequirementData from './kyc-requirements-data';

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
			KYCRequirementData={KYCRequirementData}
			onTabChange={linkTo('Notarization/Tabs', tab => tab)}
			startNotarize={linkTo('Notarization', 'Request Notarization')}
		/>
	))
	.add('informations', () => (
		<NotarizationDetailsPage
			tab="informations"
			keyRate="0.0001297225"
			KYCRequirementData={KYCRequirementData}
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
	));

const messagesReply = [
	{
		id: 809598767582156,
		name: 'John Paul',
		type: 'person',
		date: 1569504593,
		message:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.'
	},
	{
		id: 2348767582156,
		name: 'Smith Jhonson Certifier',
		type: 'certifier',
		date: 2234104593,
		message:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.  '
	},
	{
		id: 2348767582156,
		name: 'Smith Jhonson Certifier',
		type: 'certifier',
		date: 2234104593,
		message:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.  '
	}
];

storiesOf('Notarization', module)
	.add('Request Notarization', () => (
		<RequestNotarizationPage
			documents={documents}
			onBackClick={linkTo('Notarization/Tabs', 'types')}
			onStartClick={linkTo('Notarization/Popups', 'toc')}
		/>
	))
	.add('Messages', () => <NotarizationMessageWidget messages={messagesReply} />);
