import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getIncorporationPrice, getTemplateID } from '../common';
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

const IncorporationOffersTable = withStyles(styles)(
	({ classes, keyRate, data = [], onDetails, className }) => {
		return (
			<Table className={classNames(classes.table, className)}>
				<TableHead>
					<LargeTableHeadRow>
						<TableCell className={classes.flagCell} />
						<TableCell className={classes.regionCell}>
							<Typography variant="overline" gutterBottom>
								Jurisdiction
							</Typography>
						</TableCell>
						<TableCell className={classes.regionCell}>
							<Typography variant="overline" gutterBottom>
								Entity
							</Typography>
						</TableCell>
						<TableCell className={classes.smallCell}>
							<Typography variant="overline" gutterBottom>
								Offsh Tax
							</Typography>
						</TableCell>
						<TableCell className={classes.smallCell}>
							<Typography variant="overline" gutterBottom>
								Corp Tax
							</Typography>
						</TableCell>
						<TableCell className={classes.smallCell}>
							<Typography variant="overline" gutterBottom>
								Good for
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
					{data.map(inc => (
						<TableRow key={inc.id}>
							<TableCell className={classes.flagCell}>
								<FlagCountryName code={inc['Country code']} size="small" />
							</TableCell>
							<TableCell className={classes.regionCell}>{inc.Region}</TableCell>
							<TableCell className={classes.regionCell}>{inc.Acronym}</TableCell>
							<TableCell className={classes.smallCell}>
								{inc.tax['Offshore Income Tax Rate']}
							</TableCell>
							<TableCell className={classes.smallCell}>
								{inc.tax['Corporate Tax Rate']}
							</TableCell>
							<TagTableCell className={classes.goodForCell}>
								{inc['Good for'] &&
									inc['Good for'].map(tag => <Tag key={tag}>{tag}</Tag>)}
							</TagTableCell>
							<TableCell className={classes.costCell}>
								<ProgramPrice
									label="$"
									price={getIncorporationPrice(inc)}
									rate={keyRate}
								/>
							</TableCell>
							<TableCell className={classes.detailsCell}>
								<span
									onClick={() => {
										onDetails({
											companyCode: inc['Company code'],
											countryCode: inc['Country code'],
											templateID: getTemplateID(inc)
										});
									}}
								>
									Details
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
);

export default IncorporationOffersTable;
export { IncorporationOffersTable };
