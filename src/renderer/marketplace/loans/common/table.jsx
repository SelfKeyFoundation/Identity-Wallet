import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography /*IconButton, Grid*/ } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import { LargeTableHeadRow /*TagTableCell, Tag, KeyTooltip, InfoTooltip*/ } from 'selfkey-ui';

const styles = theme => ({
	table: {
		'& td': {
			padding: '0 20px'
		},
		'& th': {
			padding: '0 20px'
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
	tableBodyRow: {
		'& span.category': {
			display: 'inline-block',
			margin: '2px 5px',
			padding: '2px 8px',
			color: '#93B0C1',
			background: '#1E262E',
			borderRadius: '10px',
			fontSize: '12px',
			lineHeight: '19px'
		},
		'& span.price-key': {
			color: '#93B0C1',
			fontSize: '12px',
			display: 'block',
			whiteSpace: 'nowrap',
			margin: '2px auto'
		}
	},
	tableRow: {
		'& td': {
			padding: '15px 20px'
		}
	},

	flagCell: {
		width: '10px'
	},

	detailsCell: {
		width: '55px',
		color: '#00C0D9',
		'& span': {
			cursor: 'pointer'
		}
	}
});

const LoansTable = withStyles(styles)(({ classes, inventory = [], onDetails, className }) => {
	return (
		<Table className={classNames(classes.table, className)}>
			<TableHead>
				<LargeTableHeadRow>
					<TableCell className={classes.flagCell} />
					<TableCell>
						<Typography variant="overline">Name</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Type</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Assets Accepted</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Interest Rates</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Interest Amounts</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="overline">Revenue</Typography>
					</TableCell>
					<TableCell className={classes.detailsCell} />
				</LargeTableHeadRow>
			</TableHead>
			<TableBody className={classes.tableBodyRow} />
		</Table>
	);
});

export default LoansTable;
export { LoansTable };
