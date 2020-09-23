import React from 'react';
import { storiesOf } from '@storybook/react';
import { tokens } from './__fixtures__/token-data';
import { contractAllowance } from './__fixtures__/contracts-allowance';
import { ContractAllowanceList } from '../src/renderer/contract/allowance-list/allowance-list';
import { AllowanceEditor } from '../src/renderer/contract/allowance-editor/allowance-editor';
import { ContractChooser } from '../src/renderer/contract/allowance-editor/contract-chooser';
import { ContractTokensChooser } from '../src/renderer/contract/allowance-editor/contract-tokens-chooser';
import { action } from '@storybook/addon-actions';
import { AllowanceAmount } from '../src/renderer/contract/allowance-editor/allowance-amount';
import { AllowanceTransactionFee } from '../src/renderer/contract/allowance-editor/allowance-transaction-fee';

storiesOf('Contract/AllowanceList', module).add('main', () => (
	<ContractAllowanceList allowances={contractAllowance} tokens={tokens} />
));
storiesOf('Contract/Editor', module)
	.add('default', () => (
		<AllowanceEditor
			tokens={tokens}
			currentAmount={10}
			onGasStationReload={action('reload gas station')}
			onGasLimitChange={action('change gas limit')}
			onGasPriceChange={action('change gas price')}
			onConfirm={action('confirm')}
			onCancel={action('cancel')}
		/>
	))
	.add('selected', () => (
		<AllowanceEditor
			tokens={tokens}
			currentAmount={10}
			selectedToken={tokens[0]}
			contractAddress="0xsdasdsadasdas"
			locale="en"
			transactionInfo={{
				nonce: 10,
				gasPrice: 5,
				gasLimit: 30,
				ethFee: '15.33131',
				fiatCurrency: 'USD',
				usdFee: '12341'
			}}
			ethGasStationInfo={{ safeLow: '10', average: '15', fast: '20' }}
			onGasStationReload={action('reload gas station')}
			onGasLimitChange={action('change gas limit')}
			onGasPriceChange={action('change gas price')}
			onConfirm={action('confirm')}
			onCancel={action('cancel')}
		/>
	))
	.add('fixed', () => (
		<AllowanceEditor
			tokens={tokens}
			fixed
			currentAmount={10}
			selectedToken={tokens[0]}
			contractAddress="0xsdasdsadasdas"
			locale="en"
			transactionInfo={{
				nonce: 10,
				gasPrice: 5,
				gasLimit: 30,
				ethFee: '15.33131',
				fiatCurrency: 'USD',
				usdFee: '12341'
			}}
			ethGasStationInfo={{ safeLow: '10', average: '15', fast: '20' }}
			onGasStationReload={action('reload gas station')}
			onGasLimitChange={action('change gas limit')}
			onGasPriceChange={action('change gas price')}
			onConfirm={action('confirm')}
			onCancel={action('cancel')}
		/>
	));

storiesOf('Contract/Editor/Amount', module)
	.add('default', () => <AllowanceAmount currentAmount={10} title={'Change Allowance'} />)
	.add('requested', () => (
		<AllowanceAmount currentAmount={10} requestedAmount={1000} title={'Change Allowance'} />
	))
	.add('changed amount', () => (
		<AllowanceAmount
			currentAmount={10}
			requestedAmount={1000}
			amount={20}
			title={'Change Allowance'}
		/>
	))
	.add('loading', () => (
		<AllowanceAmount loading requestedAmount={1000} amount={20} title={'Change Allowance'} />
	))
	.add('error', () => (
		<AllowanceAmount
			currentAmount={10}
			requestedAmount={1000}
			amount={'hi'}
			error="invalid amount"
			title={'Change Allowance'}
		/>
	));

storiesOf('Contract/Editor/ContractChooser', module)
	.add('default', () => <ContractChooser title="Input Contract" />)
	.add('with address', () => (
		<ContractChooser titleaddress="0x0ff0970e38486970e53361c3595ad516a648e41d" />
	))
	.add('with address and name', () => (
		<ContractChooser
			address="0x0ff0970e38486970e53361c3595ad516a648e41d"
			name="Deposit Contract"
		/>
	))
	.add('Fixed', () => (
		<ContractChooser
			address="0x0ff0970e38486970e53361c3595ad516a648e41d"
			name="Deposit Contract"
			fixed
		/>
	))
	.add('with error', () => (
		<ContractChooser
			address="0x0ff0970e38486970e53361c3595ad5"
			error="Invalid Contract Address"
		/>
	));
storiesOf('Contract/Editor/ContractTokensChooser', module)
	.add('default', () => <ContractTokensChooser title="Choose Token" tokens={tokens} />)
	.add('preselected', () => (
		<ContractTokensChooser
			tokens={tokens}
			selected={tokens[0]}
			onTokenChange={action('Token Change')}
		/>
	))
	.add('fixed', () => <ContractTokensChooser tokens={tokens} selected={tokens[0]} fixed />);

storiesOf('Contract/Editor/AllowanceTransactionFee', module).add('default', () => (
	<AllowanceTransactionFee
		locale="en"
		nonce={10}
		ethGasStationInfo={{ safeLow: '10', average: '15', fast: '20' }}
		reloadEthGasStationInfoAction={action('reload gas station')}
		changeGasLimitAction={action('change gas limit')}
		changeGasPriceAction={action('change gas price')}
		gasPrice={5}
		gasLimit={30}
		ethFee="15.31231"
		fiatCurrency="USD"
		usdFee="123123412412341231"
	/>
));
