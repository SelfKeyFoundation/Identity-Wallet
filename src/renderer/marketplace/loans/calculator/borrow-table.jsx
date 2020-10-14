import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { LargeTableHeadRow } from 'selfkey-ui';
import { DetailsIconButton } from '../../common';

const styles = theme => ({
	nameCell: {
		maxWidth: '220px',
		minWidth: '100px',
		padding: theme.spacing(2, 2, 2, 1),
		whiteSpace: 'pre-line',
		wordWrap: 'break-word'
	},
	tableHeaderRow: {
		'& th': {
			border: 'none',
			color: '#7F8FA4',
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '15px',
			fontWeight: 'bold',
			textTransform: 'uppercase'
		}
	},
	logoCell: {
		padding: theme.spacing(2, 0, 2, 3),
		'& img': {
			borderRadius: '5px',
			display: 'flex',
			width: '30px'
		}
	},
	detailsCell: {
		color: '#00C0D9',
		padding: theme.spacing(2),
		'& span': {
			cursor: 'pointer'
		},
		'& button': {
			maxWidth: '15px',
			minWidth: '15px',
			padding: theme.spacing(0),
			width: '15px'
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
							<DetailsIconButton onClick={() => onDetailsClick(offer)} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
);

export default LoansCalculatorBorrowTable;
export { LoansCalculatorBorrowTable };
