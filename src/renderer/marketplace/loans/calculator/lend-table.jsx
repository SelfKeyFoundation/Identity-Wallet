import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
	LargeTableHeadRow,
	Tag /* TagTableCell, Tag, KeyTooltip, InfoTooltip */
} from 'selfkey-ui';

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

const LoansCalculatorLendTable = withStyles(styles)(({ classes, data, onDetailsClick }) => (
	<Table className={classes.table}>
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
					<TableCell>{offer.name}</TableCell>
					{/*
					<TableCell />
					*/}
					<TableCell>{offer.data.type}</TableCell>
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
					<TableCell>{offer.data.interestRate}</TableCell>
					<TableCell />
					<TableCell className={classes.detailsCell}>
						<span onClick={() => onDetailsClick(offer)}>Details</span>
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
));

export default LoansCalculatorLendTable;
export { LoansCalculatorLendTable };
