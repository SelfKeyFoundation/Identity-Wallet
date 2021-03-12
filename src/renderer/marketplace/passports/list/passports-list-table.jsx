import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import { LargeTableHeadRow, TagTableCell, Tag } from 'selfkey-ui';
import { DetailsIconButton, ProgramPrice, FlagCountryName } from '../../common';

const styles = theme => ({
	table: {
		'& td': {
			padding: '5px 20px'
		},
		'& th': {
			padding: '15px 20px'
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
	costCell: {
		width: '70px'
	},
	eligibilityCell: {
		maxWidth: '245px',
		width: '245px'
	},
	eligibilityCellBody: {
		alignItems: 'center',
		display: 'flex',
		flexWrap: 'wrap',
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
		padding: '0 20px'
	},
	detailsCell: {
		color: '#00C0D9',
		'& span': {
			cursor: 'pointer'
		},
		'& button': {
			maxWidth: '15px',
			minWidth: '15px',
			padding: 0,
			width: '15px'
		}
	},
	goodForCell: {
		width: '250px',
		padding: '20px',
		whiteSpace: 'normal'
	},
	minDepositCell: {
		width: '85px'
	},
	personalVisitCell: {
		minWidth: '120px'
	},
	personalVisitText: {
		alignItems: 'center',
		display: 'flex',
		'& svg': {
			height: '15px !important',
			width: '15px !important'
		}
	}
});

const ProgramRow = withStyles(styles)(({ classes, program, onDetails, keyRate }) => {
	const data = program.data;
	return (
		<TableRow className={classes.tableRow}>
			<TableCell className={classes.flagCell}>
				<FlagCountryName code={data.countryCode} size="small" />
			</TableCell>
			<TableCell className={classes.regionCell}>
				<Typography variant="h6">{data.country}</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">{'hh'}</Typography>
			</TableCell>
			<TagTableCell className={classes.goodForCell}>
				<Grid container>
					{data.programTypeResidencyVsCitizenshipOnly &&
						data.programTypeResidencyVsCitizenshipOnly.map(tag => (
							<Tag key={tag}>{tag}</Tag>
						))}
				</Grid>
			</TagTableCell>
			<TagTableCell className={classes.goodForCell}>
				<Grid container>
					{data.visaFreeRelevantCountries &&
						data.visaFreeRelevantCountries.map(tag => <Tag key={tag}>{tag}</Tag>)}
				</Grid>
			</TagTableCell>
			<TableCell>
				<Typography variant="h6">{data.investmentAmountSingleApplicant}</Typography>
			</TableCell>
			<TableCell className={classes.costCell}>
				<ProgramPrice label="$" price={program.price} rate={keyRate} />
			</TableCell>
			<TableCell className={classes.detailsCell}>
				<DetailsIconButton
					onClick={() => onDetails(program)}
					id={`details${data.countryCode}`}
				/>
			</TableCell>
		</TableRow>
	);
});

const PassportsListTable = withStyles(styles)(
	({ classes, accountType, keyRate, inventory = [], onDetails, className }) => {
		return (
			<Table className={classNames(classes.table, className)}>
				<TableHead>
					<LargeTableHeadRow>
						<TableCell className={classes.flagCell} />
						<TableCell className={classes.regionCell}>
							<Typography variant="overline">Country</Typography>
						</TableCell>
						<TableCell className={classes.eligibilityCell}>
							<Typography variant="overline">Program</Typography>
						</TableCell>
						<TableCell className={classes.minDepositCell}>
							<Typography variant="overline">Type</Typography>
						</TableCell>
						<TableCell className={classes.goodForCell}>
							<Typography variant="overline">Visa Free Travel</Typography>
						</TableCell>
						<TableCell className={classes.costCell}>
							<Typography variant="overline">Investment</Typography>
						</TableCell>
						<TableCell className={classes.costCell}>
							<Typography variant="overline">Cost</Typography>
						</TableCell>
						<TableCell className={classes.detailsCell} />
					</LargeTableHeadRow>
				</TableHead>
				<TableBody className={classes.tableBodyRow}>
					{inventory.map(program => (
						<ProgramRow
							program={program}
							key={program.id}
							keyRate={keyRate}
							onDetails={onDetails}
						/>
					))}
				</TableBody>
			</Table>
		);
	}
);

export default PassportsListTable;
export { PassportsListTable };
