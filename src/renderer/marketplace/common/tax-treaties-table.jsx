import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import { LargeTableHeadRow } from 'selfkey-ui';
import { FlagCountryName } from './flag-country-name';

const styles = theme => ({
	table: {
		marginTop: '50px'
	},
	smallCell: {
		width: '25px'
	},
	flagCell: {
		width: '10px'
	},
	detailsCell: {
		width: '55px',
		'& a': {
			color: '#00C0D9',
			cursor: 'pointer',
			textDecoration: 'none'
		}
	},
	bottomSpace: {
		marginBottom: theme.spacing(1)
	}
});

const downloadTreatyPdf = (e, url) => window.openExternal(e, url);

const TaxTreatiesTable = withStyles(styles)(({ classes, data }) => (
	<Grid container direction="row" justify="space-evenly" alignItems="center">
		{data.length === 0 && (
			<div className={classes.table}>
				<Typography variant="body2" gutterBottom className="region">
					No Tax Treaties available
				</Typography>
			</div>
		)}
		{data.length > 0 && (
			<Table className={classes.table}>
				<TableHead>
					<LargeTableHeadRow>
						<TableCell className={classes.flagCell} />
						<TableCell>
							<Typography variant="overline" classNAme={classes.bottomSpace}>
								Country
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="overline" classNAme={classes.bottomSpace}>
								Treaty Type
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="overline" classNAme={classes.bottomSpace}>
								Date Signed
							</Typography>
						</TableCell>
						<TableCell className={classes.detailsCell}>
							<Typography variant="overline" classNAme={classes.bottomSpace}>
								PDF
							</Typography>
						</TableCell>
					</LargeTableHeadRow>
				</TableHead>
				<TableBody>
					{data.map(treaty => (
						<TableRow key={treaty.id}>
							<TableCell className={classes.flagCell}>
								<FlagCountryName code={treaty.jurisdictionCountryCode} />
							</TableCell>
							<TableCell>{treaty.jurisdiction}</TableCell>
							<TableCell>{treaty.typeEOI}</TableCell>
							<TableCell>{treaty.dateSigned}</TableCell>
							<TableCell className={classes.detailsCell}>
								<a onClick={e => downloadTreatyPdf(e, treaty.pdfUrl)}>Download</a>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		)}
	</Grid>
));

export default TaxTreatiesTable;
export { TaxTreatiesTable };
