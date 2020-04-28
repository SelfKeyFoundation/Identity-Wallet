import React from 'react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import LoansListPage from '../src/renderer/marketplace/loans/list/list-page';
import LoansTabs from '../src/renderer/marketplace/loans/list/tabs';
import LoansCalculatorCard from '../src/renderer/marketplace/loans/common/calculator-card';
import LoansTable from '../src/renderer/marketplace/loans/common/table';
import LoansDetails from '../src/renderer/marketplace/loans/details/details';
import LoansDetailsHighlights from '../src/renderer/marketplace/loans/details/details-highlights';
import LoansDetailsTabs from '../src/renderer/marketplace/loans/details/details-tabs';
import LoansFilters from '../src/renderer/marketplace/loans/common/filters';
import { inventory } from './__fixtures__/loans-data';

storiesOf('Loans', module)
	.add('List Page', () => (
		<div style={{ width: '1140px' }}>
			<LoansListPage inventory={inventory} />
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
			<LoansFilters />
		</div>
	))

	.add('Filters with selected values', () => (
		<div style={{ width: '1140px' }}>
			<LoansFilters
				selectedToken={'KEY'}
				isLicensed={true}
				isP2P={true}
				range={{ min: 5, max: 50 }}
			/>
		</div>
	))

	.add('Loans Table Lending', () => (
		<div style={{ width: '1140px' }}>
			<LoansTable inventory={inventory} filter="lending" />
		</div>
	))

	.add('Loans Table Borrowing', () => (
		<div style={{ width: '1140px' }}>
			<LoansTable inventory={inventory} filter="borrowing" />
		</div>
	))

	.add('Loans Details', () => (
		<div style={{ width: '1140px' }}>
			<LoansDetails item={inventory[0]} />
		</div>
	))

	.add('Loans Details Tabs', () => (
		<div style={{ width: '1140px' }}>
			<LoansDetailsTabs item={inventory[0]} />
		</div>
	))

	.add('Loans Details Highlight', () => (
		<div style={{ width: '1140px' }}>
			<LoansDetailsHighlights item={inventory[0]} />
		</div>
	));
