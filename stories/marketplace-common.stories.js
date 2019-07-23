import React from 'react';
// import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import {
	FlagCountryName,
	ProgramPrice,
	PageLoading,
	ResumeTableEntry,
	ResumeTable,
	ResumeBox
} from '../src/renderer/marketplace/common';

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

const resumeItemSets = [
	[
		{
			name: 'Offshore Tax',
			value: '10%'
		},
		{
			name: 'Devidients Received',
			value: '48%',
			highlited: true
		}
	],
	[
		{
			name: 'Offshore Tax',
			value: '10%'
		},
		{
			name: 'Devidients Received',
			value: '48%',
			highlited: true
		}
	],
	[
		{
			name: 'Cards',
			value: ['Debit Card (SG)', 'Credit Card (USD)'],
			highlited: true
		}
	]
];

storiesOf('Marketplace Common/Resume Table', module)
	.add('Single', () => <ResumeTableEntry {...resumeItemSets[0][0]} />)
	.add('Single highlited', () => <ResumeTableEntry {...resumeItemSets[0][1]} />)
	.add('Table', () => <ResumeTable items={resumeItemSets[0]} />)
	.add('Resume Box', () => <ResumeBox itemSets={resumeItemSets} />);
