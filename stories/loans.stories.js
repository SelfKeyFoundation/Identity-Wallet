import React from 'react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import LoansListPage from '../src/renderer/marketplace/loans/list/list-page';
import LoansTabs from '../src/renderer/marketplace/loans/common/tabs';
import LoansCalculatorCard from '../src/renderer/marketplace/loans/common/calculator-card';
import LoansTable from '../src/renderer/marketplace/loans/common/table';

storiesOf('Loans', module)
	.add('List Table', () => (
		<div style={{ width: '1140px' }}>
			<LoansListPage />
		</div>
	))

	.add('Loan Tabs', () => (
		<div style={{ width: '1140px' }}>
			<LoansTabs />
		</div>
	))

	.add('Calculator Card', () => (
		<div style={{ width: '1140px' }}>
			<LoansCalculatorCard />
		</div>
	))

	.add('Loans Table', () => (
		<div style={{ width: '1140px' }}>
			<LoansTable />
		</div>
	));
