import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import { MarketplaceLoansComponent } from '../common/marketplace-loans-component';
import {
	Tag,
	LargeTableHeadRow /* TagTableCell, Tag, KeyTooltip, InfoTooltip */
} from 'selfkey-ui';
import { LoansFilters } from './filters';
import DetailsButton from '../../bank-accounts/common/details-button';

const styles = theme => ({
	table: {
		'& td': {
			padding: '5px 20px'
		},
		'& th': {
			padding: '15px 20px'
		}
	},
	logoCell: {
		'& img': {
			width: '36px'
		}
	},
	tableHeaderRow: {
		'& th': {
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '15px',
			fontWeight: 'bold',
			color: '#7F8FA4',
			textTransform: 'uppercase',
			border: 'none'
		}
	},
	detailsCell: {
		width: '55px',
		color: '#00C0D9',
		'& span': {
			cursor: 'pointer'
		}
	}
});

class LoansTableComponent extends MarketplaceLoansComponent {
	state = {
		selectedToken: '',
		type: 'Decentralized',
		selectedRange: [0, 100]
	};

	inventoryUniqueTokens = inventory => {
		const tokens = inventory.reduce((acc, offer) => {
			const { assets } = offer.data;
			if (assets) {
				assets.forEach(t => acc.add(t));
			}
			return acc;
		}, new Set());

		return [...tokens];
	};

	inventoryRateRangeLimits = (inventory, type) => {
		const filteredInventory = this.filterLoanType(inventory, type);
		/*
		const min = Math.min.apply(
			Math,
			filteredInventory.map(o => parseFloat(o.data.interestRate))
		);
		*/
		let max = Math.max.apply(Math, filteredInventory.map(o => parseFloat(o.data.interestRate)));
		if (max === 0) {
			max = 100;
		}
		return { min: 0, max };
	};

	onTokenFilterChange = e => this.selectToken(e.target.value);

	selectToken = selectedToken => this.setState({ selectedToken });

	onTypeFilterChange = selectedType => this.setState({ selectedType });

	onRateRangeChange = (e, selectedRange) => this.setState({ selectedRange });

	render() {
		const {
			classes,
			inventory = [],
			onDetailsClick,
			className,
			filter = 'lending'
		} = this.props;
		const { selectedToken, selectedType, selectedRange } = this.state;

		let filteredInventory = inventory;

		// Filter by type lending or borrowing
		if (filter) {
			filteredInventory = this.filterLoanType(inventory, filter);
		}

		// Filter by token (assets)
		if (selectedToken) {
			filteredInventory = filteredInventory.filter(offer =>
				offer.data.assets.includes(selectedToken)
			);
		}

		// Filter by Loan Type
		if (selectedType) {
			filteredInventory = filteredInventory.filter(offer => offer.data.type === selectedType);
		}

		// Filter by Rate range
		filteredInventory = filteredInventory.filter(offer => {
			return (
				parseFloat(offer.data.interestRate) >= selectedRange[0] &&
				parseFloat(offer.data.interestRate) <= selectedRange[1]
			);
		});

		return (
			<React.Fragment>
				<LoansFilters
					tokens={this.inventoryUniqueTokens(inventory)}
					selectedToken={selectedToken}
					onTokenFilterChange={this.onTokenFilterChange}
					onTypeFilterChange={this.onTypeFilterChange}
					selectedType={selectedType}
					selectedRange={selectedRange}
					onRateRangeChange={this.onRateRangeChange}
					range={this.inventoryRateRangeLimits(inventory, filter)}
				/>
				<Table className={classNames(classes.table, className)}>
					<TableHead>
						<LargeTableHeadRow>
							<TableCell className={classes.logoCell} />
							<TableCell>
								<Typography variant="overline">Name</Typography>
							</TableCell>
							{/*
							<TableCell>
								<Typography variant="overline">Trust Score</Typography>
							</TableCell>
							*/}
							<TableCell>
								<Typography variant="overline">Type</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Current Rates</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Assets Accepted</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Max Loan</Typography>
							</TableCell>
							<TableCell className={classes.detailsCell} />
						</LargeTableHeadRow>
					</TableHead>
					<TableBody className={classes.tableBodyRow}>
						{filteredInventory.map(offer => (
							<TableRow key={offer.sku}>
								<TableCell className={classes.logoCell}>
									{offer.data.logoUrl && <img src={offer.data.logoUrl} />}
								</TableCell>
								<TableCell>
									<Typography variant="h6">{offer.name}</Typography>
								</TableCell>
								{/*
								<TableCell />
								*/}
								<TableCell>
									<Typography variant="h6">
										{offer.data.type === 'Decentralized'
											? 'P2P'
											: 'Centralized'}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="h6">{offer.data.interestRate}</Typography>
								</TableCell>
								<TableCell>
									<Grid container>
										{offer.data.assets &&
											offer.data.assets.map(tag => (
												<Tag
													key={`${offer.sku}-${tag}`}
													onClick={() => this.selectToken(tag)}
												>
													{tag}
												</Tag>
											))}
									</Grid>
								</TableCell>
								<TableCell>
									<Typography variant="h6">{offer.data.maxLoan}</Typography>
								</TableCell>
								<TableCell className={classes.detailsCell}>
									<DetailsButton onClick={() => onDetailsClick(offer)} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</React.Fragment>
		);
	}
}

const LoansTable = withStyles(styles)(LoansTableComponent);
export default LoansTable;
export { LoansTable };
