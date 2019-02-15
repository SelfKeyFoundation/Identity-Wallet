import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import { LargeTableHeadRow } from 'selfkey-ui';
import FlagCountryName from '../common/flag-country-name';

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
	loading: {
		marginTop: '5em'
	}
});

const TreatiesTable = props => {
	const { classes, data } = props;

	return (
		<Grid container direction="row" justify="space-evenly" alignItems="center">
			<Table className={classes.table}>
				<TableHead>
					<LargeTableHeadRow>
						<TableCell className={classes.flagCell} />
						<TableCell>
							<Typography variant="overline" gutterBottom>
								Country
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="overline" gutterBottom>
								Treaty Type
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="overline" gutterBottom>
								Date Signed
							</Typography>
						</TableCell>
						<TableCell className={classes.detailsCell}>
							<Typography variant="overline" gutterBottom>
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
								<a href="{treaty.pdfUrl}">Download</a>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Grid>
	);
};

export default withStyles(styles)(TreatiesTable);
