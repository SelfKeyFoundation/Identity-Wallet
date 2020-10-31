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
import { ProgramPrice, FlagCountryName, DetailsIconButton } from '../../common';

const styles = theme => ({
	table: {
		'& td': {
			height: 'auto'
		}
	},
	costCell: {
		width: '70px'
	},
	smallCell: {
		padding: theme.spacing(0, 1),
		width: '35px'
	},
	flagCell: {
		paddingRight: theme.spacing(0),
		width: '10px'
	},
	regionCell: {
		padding: theme.spacing(0),
		width: '60px'
	},
	detailsCell: {
		color: '#00C0D9',
		padding: theme.spacing(2, 3),
		'& span': {
			cursor: 'pointer'
		},
		'& button': {
			maxWidth: '15px',
			minWidth: '15px',
			padding: theme.spacing(0),
			width: '15px'
		}
	},
	goodForCell: {
		padding: theme.spacing(1),
		width: '305px'
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
							<TableCell>
								<Typography variant="h6">{inc.data.region}</Typography>
							</TableCell>
							<TableCell className={classes.regionCell}>
								<Typography variant="h6">
									{inc.data.acronym && inc.data.acronym[0]}
								</Typography>
							</TableCell>
							<TableCell className={classes.smallCell}>
								<Typography variant="h6">
									{inc.data.offshoreIncomeTaxRate}
								</Typography>
							</TableCell>
							<TableCell className={classes.smallCell}>
								<Typography variant="h6">{inc.data.corporateTaxRate}</Typography>
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
								<DetailsIconButton onClick={() => onDetailsClick(inc)} />
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
