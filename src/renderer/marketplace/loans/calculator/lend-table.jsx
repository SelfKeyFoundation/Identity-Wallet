import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { LargeTableHeadRow, Tag } from 'selfkey-ui';
import { DetailsIconButton } from '../../common';

const styles = theme => ({
	nameCell: {
		padding: '15px 15px 15px 13px',
		maxWidth: '220px',
		minWidth: '100px',
		whiteSpace: 'pre-line',
		wordWrap: 'break-word'
	},
	logoCell: {
		padding: '15px 0 15px 25px',
		'& img': {
			width: '30px',
			borderRadius: '5px',
			display: 'flex'
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
		color: '#00C0D9',
		padding: '15px 20px',
		'& span': {
			cursor: 'pointer'
		},
		'& button': {
			maxWidth: '15px',
			minWidth: '15px',
			padding: 0,
			width: '15px'
		}
	}
});

const LoansCalculatorLendTable = withStyles(styles)(
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
						<Typography variant="overline">Assets Accepted</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Interest Rate</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Revenue</Typography>
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
							<Grid container>
								{offer.data.assets &&
									offer.data.assets.map(tag => (
										<Tag key={tag} onClick={() => this.selectToken(tag)}>
											{tag}
										</Tag>
									))}
							</Grid>
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
						<TableCell className={classes.detailsCell}>
							<DetailsIconButton onClick={() => onDetailsClick(offer)} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
);

export default LoansCalculatorLendTable;
export { LoansCalculatorLendTable };
