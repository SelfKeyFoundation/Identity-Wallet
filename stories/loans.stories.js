import React from 'react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import LoansListPage from '../src/renderer/marketplace/loans/list/list-page';
import LoansTabs from '../src/renderer/marketplace/loans/list/tabs';
import LoansCalculatorCard from '../src/renderer/marketplace/loans/common/calculator-card';
import LoansTable from '../src/renderer/marketplace/loans/common/table';
import LoansFilters from '../src/renderer/marketplace/loans/common/filters';
import { tokens, inventory } from './__fixtures__/loans-data';

storiesOf('Loans', module)
	.add('List Page', () => (
		<div style={{ width: '1140px' }}>
			<LoansListPage inventory={inventory} tokens={tokens} />
		</div>
	))

	.add('Loan Tabs', () => (
		<div style={{ width: '1140px' }}>
			<LoansTabs />
		</div>
	))

	.add('Loan Tabs with selected value', () => (
		<div style={{ width: '1140px' }}>
			<LoansTabs tab={'calculator'} />
		</div>
	))

	.add('Calculator Card', () => (
		<div style={{ width: '1140px' }}>
			<LoansCalculatorCard />
		</div>
	))

	.add('Filters', () => (
		<div style={{ width: '1140px' }}>
			<LoansFilters tokens={tokens} />
		</div>
	))

	.add('Filters with selected values', () => (
		<div style={{ width: '1140px' }}>
			<LoansFilters tokens={tokens} selectedToken={'KEY'} isLicensed={true} isP2P={true} />
		</div>
	))

	.add('Loans Table', () => (
		<div style={{ width: '1140px' }}>
			<LoansTable tokens={tokens} inventory={inventory} />
		</div>
	));
