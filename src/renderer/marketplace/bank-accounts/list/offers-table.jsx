import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import { LargeTableHeadRow, TagTableCell, Tag } from 'selfkey-ui';
import { ProgramPrice, FlagCountryName } from '../../common';

const styles = theme => ({
	table: {
		'& td': {
			height: 'auto'
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
	costCell: {
		width: '70px'
	},
	eligibilityCell: {
		maxWidth: '245px',
		width: '245px'
	},
	eligibilityCellBody: {
		paddingTop: '15px',
		paddingBottom: '15px',
		whiteSpace: 'normal',
		lineHeight: '19px',
		maxWidth: '245px'
	},
	flagCell: {
		width: '10px'
	},
	regionCell: {
		minWidth: '100px',
		lineHeight: '19px',
		whiteSpace: 'normal',
		padding: '0'
	},
	detailsCell: {
		width: '55px',
		color: '#00C0D9',
		'& span': {
			cursor: 'pointer'
		}
	},
	goodForCell: {
		maxWidth: '200px',
		width: '200px',
		padding: '10px',
		whiteSpace: 'normal'
	},
	minDepositCell: {
		width: '85px'
	},
	personalVisitCell: {
		width: '105px'
	}
});

export const BankingOffersTable = withStyles(styles)(
	({ classes, keyRate, data = [], onDetails, className }) => {
		return (
			<Table className={classNames(classes.table, className)}>
				<TableHead>
					<LargeTableHeadRow>
						<TableCell className={classes.flagCell} />
						<TableCell className={classes.regionCell}>
							<Typography variant="overline" gutterBottom>
								Region
							</Typography>
						</TableCell>
						<TableCell className={classes.eligibilityCell}>
							<Typography variant="overline" gutterBottom>
								Eligibility
							</Typography>
						</TableCell>
						<TableCell className={classes.minDepositCell}>
							<Typography variant="overline" gutterBottom>
								Min. Deposit
							</Typography>
						</TableCell>
						<TableCell className={classes.goodForCell}>
							<Typography variant="overline" gutterBottom>
								Good for
							</Typography>
						</TableCell>
						<TableCell className={classes.personalVisitCell}>
							<Typography variant="overline" gutterBottom>
								Personal Visit
							</Typography>
						</TableCell>
						<TableCell className={classes.costCell}>
							<Typography variant="overline" gutterBottom>
								Cost
							</Typography>
						</TableCell>
						<TableCell className={classes.detailsCell} />
					</LargeTableHeadRow>
				</TableHead>
				<TableBody className={classes.tableBodyRow}>
					{data.map(bank => (
						<TableRow key={bank.id}>
							<TableCell className={classes.flagCell}>
								<FlagCountryName code={bank.countryCode} size="small" />
							</TableCell>
							<TableCell className={classes.regionCell}>{bank.region}</TableCell>
							<TableCell className={classes.eligibilityCellBody}>
								{bank.eligibility &&
									bank.eligibility.map(tag => <Tag key={tag}>{tag}</Tag>)}
							</TableCell>
							<TableCell className={classes.minDepositCell}>
								{bank.minDeposit}
							</TableCell>
							<TagTableCell className={classes.goodForCell}>
								{bank.goodFor &&
									bank.goodFor.map(tag => <Tag key={tag}>{tag}</Tag>)}
							</TagTableCell>
							<TableCell className={classes.personalVisitCell}>
								{bank.personalVisit ? 'Required' : 'No'}
							</TableCell>
							<TableCell className={classes.costCell}>
								<ProgramPrice label="$" price={bank.Price} rate={keyRate} />
							</TableCell>
							<TableCell className={classes.detailsCell}>
								<span onClick={() => onDetails(bank)}>Details</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
);

export default BankingOffersTable;
