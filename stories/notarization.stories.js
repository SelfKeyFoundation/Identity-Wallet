/*
import React from 'react';
import { storiesOf } from '@storybook/react';
import NotarizationDetailsPage from '../src/renderer/marketplace/notarization/details/notarization-details-page';
import RequestNotarizationPage from '../src/renderer/marketplace/notarization/process/request-notarization-page';

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
	.add('Supported Doc Types', () => <NotarizationDetailsPage tab="types" />)
	.add('Key Informations', () => <NotarizationDetailsPage tab="informations" />);

storiesOf('Notarization', module).add('Request Notarization', () => (
	<RequestNotarizationPage documents={documents} />
));
*/
