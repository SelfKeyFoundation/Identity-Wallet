import React from 'react';
import { storiesOf } from '@storybook/react';
import SelfkeyIdOverview from '../src/renderer/selfkey-id/main/components/selfkey-id-overview';
import SelfkeyIdApplications from '../src/renderer/selfkey-id/main/components/selfkey-id-applications';
import SelfkeyId from '../src/renderer/selfkey-id/main/components/selfkey-id';
storiesOf('SelfkeyId', module)
	.add('SelfkeyId', () => <SelfkeyId tab={0} component={<span>test component</span>} />)
	.add('SelfkeyIdApplications', () => (
		<SelfkeyIdApplications
			showApplicationRefreshModal={false}
			loading={false}
			config={{}}
			applications={[]}
		/>
	))
	.add('SelfkeyIdOverview', () => (
		<SelfkeyIdOverview
			attributes={[]}
			basicAttributes={[]}
			documents={[]}
			profilePicture={null}
			email={''}
			firstName=""
			lastName=""
			middleName=""
			wallet={{}}
			identity={{}}
		/>
	));
