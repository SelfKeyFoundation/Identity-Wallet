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

storiesOf('Contract/AllowanceList', module).add('main', () => (
	<ContractAllowanceList allowances={contractAllowance} tokens={tokens} />
));
storiesOf('Contract/Editor', module)
	.add('default', () => <AllowanceEditor tokens={tokens} currentAmount={10} />)
	.add('selected', () => (
		<AllowanceEditor
			tokens={tokens}
			currentAmount={10}
			selectedToken={tokens[0]}
			contractAddress="0xsdasdsadasdas"
		/>
	));

storiesOf('Contract/Editor/Amount', module)
	.add('default', () => <AllowanceAmount currentAmount={10} />)
	.add('requested', () => <AllowanceAmount currentAmount={10} requestedAmount={1000} />)
	.add('changed amount', () => (
		<AllowanceAmount currentAmount={10} requestedAmount={1000} amount={20} />
	))
	.add('loading', () => <AllowanceAmount loading />)
	.add('error', () => (
		<AllowanceAmount
			currentAmount={10}
			requestedAmount={1000}
			amount={'hi'}
			error="invalid amount"
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
