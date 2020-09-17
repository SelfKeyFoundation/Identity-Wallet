import React from 'react';
import { storiesOf } from '@storybook/react';
import { tokens } from './__fixtures__/token-data';
import { contractAllowance } from './__fixtures__/contracts-allowance';
import { ContractAllowanceList } from '../src/renderer/contract/allowance/allowance-list';

storiesOf('Contract', module).add('AllowanceList', () => (
	<ContractAllowanceList allowances={contractAllowance} tokens={tokens} />
));
