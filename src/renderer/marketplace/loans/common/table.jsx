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

const LoansTable = withStyles(styles)(({ classes, inventory = [], onDetails, className }) => {
	return (
		<React.Fragment>
			<div>
				<LoansFilters />
			</div>
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
		</React.Fragment>
	);
});

export default LoansTable;
export { LoansTable };
