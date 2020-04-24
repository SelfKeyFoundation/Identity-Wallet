import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import {
	Tag,
	LargeTableHeadRow /* TagTableCell, Tag, KeyTooltip, InfoTooltip */
} from 'selfkey-ui';
import { LoansFilters } from './filters';

const styles = theme => ({
	table: {
		'& td': {
			padding: '0 20px'
		},
		'& th': {
			padding: '0 20px'
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

class LoansTableComponent extends PureComponent {
	state = {
		selectedToken: false,
		isP2P: false,
		isLicensed: false,
		selectedRange: [0, 100]
	};

	inventoryUniqueTokens = inventory => {
		const tokens = inventory.reduce((acc, offer) => {
			const { assets } = offer.data;
			assets.forEach(t => acc.add(t));
			return acc;
		}, new Set());

		return [...tokens];
	};

	inventoryRateRange = inventory => {
		const min = Math.min.apply(Math, inventory.map(o => parseFloat(o.data.interestRate)));
		const max = Math.max.apply(Math, inventory.map(o => parseFloat(o.data.interestRate)));
		return { min, max };
	};

	onTokenFilterChange = e => this.selectToken(e.target.value);

	selectToken = selectedToken => this.setState({ selectedToken });

	onP2pFilterChange = e => this.setState(prevState => ({ isP2P: !prevState.isP2P }));

	onLicensedFilterChange = e =>
		this.setState(prevState => ({ isLicensed: !prevState.isLicensed }));

	onRateRangeChange = (e, selectedRange) => this.setState({ selectedRange });

	render() {
		const { classes, inventory = [], onDetailsClick, className } = this.props;
		const { selectedToken, isLicensed, isP2P, selectedRange } = this.state;

		let filteredInventory = inventory;

		if (selectedToken) {
			filteredInventory = filteredInventory.filter(offer =>
				offer.data.assets.includes(selectedToken)
			);
		}

		if (isLicensed) {
			filteredInventory = filteredInventory.filter(offer => !!offer.data.licensed);
		}

		if (isP2P) {
			filteredInventory = filteredInventory.filter(
				({ data: { type } }) => !!type === 'Decentralized'
			);
		}

		filteredInventory = filteredInventory.filter(({ data: { interestRate: rate } }) => {
			return parseFloat(rate) >= selectedRange[0] && parseFloat(rate) <= selectedRange[1];
		});

		return (
			<React.Fragment>
				<div>
					<LoansFilters
						tokens={this.inventoryUniqueTokens(inventory)}
						selectedToken={selectedToken}
						onTokenFilterChange={this.onTokenFilterChange}
						isP2P={isP2P}
						onP2pFilterChange={this.onP2pFilterChange}
						isLicensed={isLicensed}
						onLicensedFilterChange={this.onLicensedFilterChange}
						selectedRange={selectedRange}
						onRateRangeChange={this.onRateRangeChange}
						range={this.inventoryRateRange(inventory)}
					/>
				</div>
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
								<TableCell>{offer.name}</TableCell>
								{/*
								<TableCell />
								*/}
								<TableCell>{offer.data.type}</TableCell>
								<TableCell>{offer.data.interestRate}</TableCell>
								<TableCell>
									<Grid container>
										{offer.data.assets &&
											offer.data.assets.map(tag => (
												<Tag
													key={tag}
													onClick={() => this.selectToken(tag)}
												>
													{tag}
												</Tag>
											))}
									</Grid>
								</TableCell>
								<TableCell>{offer.data.maxLoan}</TableCell>
								<TableCell className={classes.detailsCell}>
									<span onClick={() => onDetailsClick(offer)}>Details</span>
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
