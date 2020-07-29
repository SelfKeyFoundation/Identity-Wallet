import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { LargeTableHeadRow } from 'selfkey-ui';
import DetailsButton from '../../bank-accounts/common/details-button';

const styles = theme => ({
	nameCell: {
		padding: '15px 15px 15px 13px',
		maxWidth: '220px',
		minWidth: '100px',
		whiteSpace: 'pre-line',
		wordWrap: 'break-word'
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
		padding: '15px'
	},
	logoCell: {
		padding: '15px 0 15px 25px',
		'& img': {
			width: '30px',
			borderRadius: '5px',
			display: 'flex'
		}
	}
});

const LoansCalculatorBorrowTable = withStyles(styles)(
	({ classes, data, currency, onDetailsClick }) => (
		<Table className={classes.table}>
			<TableHead>
				<LargeTableHeadRow>
					<TableCell className={classes.logoCell} />
					<TableCell className={classes.nameCell}>
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
						<Typography variant="overline">Collateral Needed</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Interest Rate</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Interest Amount</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Monthly Payment</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Repayment Amount</Typography>
					</TableCell>
					<TableCell className={classes.detailsCell} />
				</LargeTableHeadRow>
			</TableHead>
			<TableBody className={classes.tableBodyRow}>
				{data.map(offer => (
					<TableRow key={offer.sku}>
						<TableCell className={classes.logoCell}>
							{offer.data.logoUrl && <img src={offer.data.logoUrl} />}
						</TableCell>
						<TableCell className={classes.nameCell}>
							<Typography variant="h6">{offer.name}</Typography>
						</TableCell>
						{/*
							<TableCell />
						*/}
						<TableCell>
							<Typography variant="h6">
								{offer.data.type === 'Decentralized' ? 'P2P' : 'Centralized'}
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="h6">{offer.collateral}</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="h6">{offer.data.interestRate}</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="h6">
								{offer.loanPayment.totalInterest.toLocaleString('en-US', {
									style: 'currency',
									currency
								})}
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="h6">
								{offer.loanPayment.monthly.toLocaleString('en-US', {
									style: 'currency',
									currency
								})}
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="h6">
								{parseFloat(offer.loanPayment.total).toLocaleString('en-US', {
									style: 'currency',
									currency
								})}
							</Typography>
						</TableCell>
						<TableCell className={classes.detailsCell}>
							<DetailsButton onClick={() => onDetailsClick(offer)} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
);

export default LoansCalculatorBorrowTable;
export { LoansCalculatorBorrowTable };
