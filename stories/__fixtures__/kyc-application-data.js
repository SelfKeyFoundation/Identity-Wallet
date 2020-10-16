import { text } from '@storybook/addon-knobs';

export const individualApplication = {
	rpName: 'relyingPartyName',
	templateId: 'test-template-id',
	returnRoute: '/return-route',
	cancelRoute: '/cancel-route',
	title: 'Test Process title',
	description: 'Test process description',
	agreement: 'test agreement',
	vendor: 'test-vendor',
	privacyPolicy: 'test privacy policy',
	termsOfService: 'test terms of service'
};

export const individualApplicationKnobs = () => ({
	rpName: text('Individual Application Relying Party Name', 'relyingPartyName'),
	templateId: text('Individual Application templateId', 'test-template-id'),
	returnRoute: text('Individual Application return route', '/return-route'),
	cancelRoute: text('Individual Application cancel route', '/cancel-route'),
	title: text('Individual Application title', 'Test Process title'),
	description: text('Individual Application description', 'Test process description'),
	agreement: text('Individual Application agreement', 'test agreement'),
	vendor: text('Individual Application vendor', 'test-vendor'),
	privacyPolicy: text('Individual Application privacy policy', 'test privacy policy'),
	termsOfService: text('Individual Application terms of service', 'test terms of service')
});

export const relyingParty = {
	name: 'relyingPartyName'
};
