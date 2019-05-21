import React from 'react';
// import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { FlagCountryName, ProgramPrice, PageLoading } from '../src/renderer/marketplace/common';

storiesOf('Marketplace Common', module)
	.add('PageLoading', () => <PageLoading />)
	.add('ProgramPrice', () => <ProgramPrice price={10} rate={0.5} label="Label" />)
	.add('FlagCountryName', () => (
		<div>
			<FlagCountryName code="ua" name="UA" />
			<br />
			<br />
			<FlagCountryName code="us" name="us" />
			<br />
			<br />
			<FlagCountryName code="gb" name="UK" />
			<br />
			<br />
		</div>
	));
