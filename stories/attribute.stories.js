import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { CreateAttribute } from '../src/renderer/attributes/create-attribute';
import { EditAttribute } from '../src/renderer/attributes/edit-attribute';
import { DeleteAttribute } from '../src/renderer/attributes/delete-attribute';

storiesOf('Attributes/CreateAttribute', module).add('default', () => (
	<CreateAttribute
		onSave={action('save')}
		onCancel={action('cancel')}
		uiSchemas={[]}
		isDocument={false}
		types={[]}
		open={true}
		text={'Create Attribute'}
		subtitle={'subtitle'}
		typeId=""
	/>
));

storiesOf('Attributes/EditAttribute', module).add('default', () => (
	<EditAttribute
		onSave={action('save')}
		onCancel={action('cancel')}
		uiSchema={{}}
		attribute={{
			id: 1,
			type: { content: { title: 'hi' } },
			data: {},
			documents: [],
			name: 'test'
		}}
		types={[]}
		open={true}
		text={'Create Attribute'}
		subtitle={'subtitle'}
		typeId=""
	/>
));

storiesOf('Attributes/DeleteAttribute', module).add('default', () => (
	<DeleteAttribute
		onConfirm={action('confirm')}
		onCancel={action('cancel')}
		attribute={{
			id: 1,
			type: { content: { title: 'hi' } },
			data: {},
			documents: [],
			name: 'test'
		}}
		open={true}
		text={'Create Attribute'}
	/>
));
