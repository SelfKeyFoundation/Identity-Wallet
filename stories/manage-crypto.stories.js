import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CryptoPriceTable from '../src/renderer/crypto-manager/crypto-price-table';
import { tokens } from './__fixtures__/token-data';
import { AddToken } from '../src/renderer/crypto-manager/add-token';
import { CryptoManager } from '../src/renderer/crypto-manager/crypto-manager';

storiesOf('CryptoManager/Manager', module)
	.add('default', () => (
		<CryptoManager
			cryptoPriceTableComponent={
				<CryptoPriceTable
					locale="en"
					alwaysVisible={['0xasdrqweer123rqa']}
					tokens={tokens}
					fiatCurrency="USD"
					toggleAction={action('visibility toggle')}
					onManageAllowanceClick={action('manage allowance')}
				/>
			}
			locale="en"
			onCloseTokenAddedModal={action('close token added')}
			onCloseTokenRemovedModal={action('close token removed')}
			onBackClick={action('back')}
			onAddTokenClick={action('add token')}
			onManageAllowanceClick={action('manage allowance')}
		/>
	))
	.add('token added', () => (
		<CryptoManager
			cryptoPriceTableComponent={
				<CryptoPriceTable
					locale="en"
					alwaysVisible={['0xasdrqweer123rqa']}
					tokens={tokens}
					fiatCurrency="USD"
					toggleAction={action('visibility toggle')}
				/>
			}
			locale="en"
			tokenAdded={tokens[1]}
			showAddedModal
			onCloseTokenAddedModal={action('close token added')}
			onCloseTokenRemovedModal={action('close token removed')}
			onBackClick={action('back')}
			onAddTokenClick={action('add token')}
		/>
	))
	.add('token removed', () => (
		<CryptoManager
			cryptoPriceTableComponent={
				<CryptoPriceTable
					locale="en"
					alwaysVisible={['0xasdrqweer123rqa']}
					tokens={tokens}
					fiatCurrency="USD"
					toggleAction={action('visibility toggle')}
				/>
			}
			locale="en"
			showRemovedModal
			onCloseTokenAddedModal={action('close token added')}
			onCloseTokenRemovedModal={action('close token removed')}
			onBackClick={action('back')}
			onAddTokenClick={action('add token')}
		/>
	));

storiesOf('CryptoManager/PriceTable', module).add('default', () => (
	<CryptoPriceTable
		locale="en"
		alwaysVisible={['0xasdrqweer123rqa']}
		tokens={tokens}
		fiatCurrency="USD"
		toggleAction={action('visibility toggle')}
		onManageAllowanceClick={action('manage allowance')}
	/>
));

storiesOf('CryptoManager/AddToken', module)
	.add('default', () => (
		<AddToken
			addressError=""
			tokenError=""
			address=""
			found={false}
			duplicate={false}
			searching={false}
			onFieldChange={action('field change')}
			onSubmit={action('submit')}
			onBackClick={action('back click')}
			onHelpClick={action('help click')}
		/>
	))

	.add('searching', () => (
		<AddToken
			addressError=""
			tokenError=""
			address="0x4cc19356f2d37338b9802aa8e8fc58b0373296e7"
			found={false}
			duplicate={false}
			searching={true}
			onFieldChange={action('field change')}
			onSubmit={action('submit')}
			onBackClick={action('back click')}
			onHelpClick={action('help click')}
		/>
	))
	.add('no found', () => (
		<AddToken
			addressError=""
			tokenError=""
			address="0x4cc19356f2d37338b9802aa8e8fc58b0373296e7"
			found={false}
			duplicate={false}
			searching={false}
			onFieldChange={action('field change')}
			onSubmit={action('submit')}
			onBackClick={action('back click')}
			onHelpClick={action('help click')}
		/>
	))
	.add('address error', () => (
		<AddToken
			addressError="address error"
			tokenError=""
			address="0x4cc19356f2d37338b9802aa8e8fc58b0373296e7"
			found={false}
			duplicate={false}
			searching={false}
			onFieldChange={action('field change')}
			onSubmit={action('submit')}
			onBackClick={action('back click')}
			onHelpClick={action('help click')}
		/>
	))
	.add('token error', () => (
		<AddToken
			addressError=""
			tokenError="token error"
			address="0x4cc19356f2d37338b9802aa8e8fc58b0373296e7"
			found={false}
			duplicate={false}
			searching={false}
			onFieldChange={action('field change')}
			onSubmit={action('submit')}
			onBackClick={action('back click')}
			onHelpClick={action('help click')}
		/>
	))
	.add('duplicate', () => (
		<AddToken
			addressError=""
			tokenError=""
			address="0x4cc19356f2d37338b9802aa8e8fc58b0373296e7"
			found={true}
			duplicate={true}
			searching={false}
			symbol="KEY"
			decimal={10}
			onFieldChange={action('field change')}
			onSubmit={action('submit')}
			onBackClick={action('back click')}
			onHelpClick={action('help click')}
		/>
	))
	.add('found', () => (
		<AddToken
			addressError=""
			tokenError=""
			address="0x4cc19356f2d37338b9802aa8e8fc58b0373296e7"
			found={true}
			duplicate={false}
			searching={false}
			symbol="KEY"
			decimal={10}
			onFieldChange={action('field change')}
			onSubmit={action('submit')}
			onBackClick={action('back click')}
			onHelpClick={action('help click')}
		/>
	));
