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
	smallCell: {
		width: '35px',
		padding: '0 10px'
	},
	flagCell: {
		width: '10px',
		paddingRight: '0'
	},
	regionCell: {
		width: '60px',
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
		width: '305px',
		padding: '10px'
	}
	/*
	loading: {
		marginTop: '5em'
	},
	bold: {
		fontWeight: 600
	},
	backButtonContainer: {
		left: '15px',
		position: 'absolute',
		top: '120px'
	},
	icon: {
		height: '36px',
		width: '36px'
	}
	*/
});

const IncorporationsListTable = withStyles(styles)(
	({ classes, keyRate, data = [], onDetailsClick, className }) => {
		return (
			<Table className={classNames(classes.table, className)}>
				<TableHead>
					<LargeTableHeadRow>
						<TableCell className={classes.flagCell} />
						<TableCell>
							<Typography variant="overline">Jurisdiction</Typography>
						</TableCell>
						<TableCell className={classes.regionCell}>
							<Typography variant="overline">Entity</Typography>
						</TableCell>
						<TableCell className={classes.smallCell}>
							<Typography variant="overline">Offsh Tax</Typography>
						</TableCell>
						<TableCell className={classes.smallCell}>
							<Typography variant="overline">Corp Tax</Typography>
						</TableCell>
						<TableCell className={classes.goodForCell}>
							<Typography variant="overline">Good for</Typography>
						</TableCell>
						<TableCell className={classes.costCell}>
							<Typography variant="overline">Cost</Typography>
						</TableCell>
						<TableCell className={classes.detailsCell} />
					</LargeTableHeadRow>
				</TableHead>
				<TableBody className={classes.tableBodyRow}>
					{data.map(inc => (
						<TableRow key={inc.id}>
							<TableCell className={classes.flagCell}>
								<FlagCountryName code={inc.data.countryCode} size="small" />
							</TableCell>
							<TableCell>{inc.data.region}</TableCell>
							<TableCell className={classes.regionCell}>
								{inc.data.acronym && inc.data.acronym[0]}
							</TableCell>
							<TableCell className={classes.smallCell}>
								{inc.data.offshoreIncomeTaxRate}
							</TableCell>
							<TableCell className={classes.smallCell}>
								{inc.data.corporateTaxRate}
							</TableCell>
							<TagTableCell className={classes.goodForCell}>
								<Grid container>
									{inc.data.goodFor &&
										inc.data.goodFor.map(tag => <Tag key={tag}>{tag}</Tag>)}
								</Grid>
							</TagTableCell>
							<TableCell className={classes.costCell}>
								<ProgramPrice label="$" price={inc.price} rate={keyRate} />
							</TableCell>
							<TableCell className={classes.detailsCell}>
								<span onClick={() => onDetailsClick(inc)}>Details</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
);

export default IncorporationsListTable;
export { IncorporationsListTable };
