import React from 'react';
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

const LoansTable = withStyles(styles)(
	({
		classes,
		inventory = [],
		onDetailsClick,
		className,
		tokens,
		selectedToken,
		onTokenFilterChange,
		isP2P,
		onP2pFilterChange,
		isLicensed,
		onLicensedFilterChange
	}) => {
		return (
			<React.Fragment>
				<div>
					<LoansFilters
						tokens={tokens}
						selectedToken={selectedToken}
						onTokenFilterChange={onTokenFilterChange}
						isP2P={isP2P}
						onP2pFilterChange={onP2pFilterChange}
						isLicensed={isLicensed}
						onLicensedFilterChange={onLicensedFilterChange}
					/>
				</div>
				<Table className={classNames(classes.table, className)}>
					<TableHead>
						<LargeTableHeadRow>
							<TableCell className={classes.logoCell} />
							<TableCell>
								<Typography variant="overline">Name</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Trust Score</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Type</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Current Rates</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">30 Days AVG</Typography>
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
						{inventory.map(offer => (
							<TableRow key={offer.sku}>
								<TableCell className={classes.logoCell}>
									{offer.data.logoUrl && <img src={offer.data.logoUrl} />}
								</TableCell>
								<TableCell>{offer.name}</TableCell>
								<TableCell />
								<TableCell>{offer.data.type}</TableCell>
								<TableCell>{offer.data.interestRate}</TableCell>
								<TableCell />
								<TableCell>
									<Grid container>
										{offer.data.assets &&
											offer.data.assets.map(tag => (
												<Tag key={tag}>{tag}</Tag>
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
);

export default LoansTable;
export { LoansTable };
