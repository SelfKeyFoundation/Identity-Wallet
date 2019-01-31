import React from 'react';
import injectSheet from 'react-jss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';

const styles = {
	header: {
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: '38px'
	},
	headerTitle: {
		paddingLeft: '21px'
	},
	table: {
		tableLayout: 'fixed'
	},
	tableHeaderRow: {
		'& th': {
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '15px', // 12 px invision
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
		width: '50px'
	},
	smallCell: {
		width: '25px'
	},
	flagCell: {
		width: '10px'
	},
	regionCell: {
		width: '30px'
	},
	detailsCell: {
		width: '55px',
		color: '#00C0D9',
		'& span': {
			cursor: 'pointer'
		}
	},
	goodForCell: {
		width: '325px'
	},
	loading: {
		marginTop: '5em'
	}
};

const TreatiesTable = props => {
	const { classes } = props;

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
						<TableCell className={classes.smallCell}>
							<Typography variant="overline" gutterBottom>
								Treaty Type
							</Typography>
						</TableCell>
						<TableCell className={classes.smallCell}>
							<Typography variant="overline" gutterBottom>
								Date Signed
							</Typography>
						</TableCell>
						<TableCell className={classes.smallCell}>
							<Typography variant="overline" gutterBottom>
								PDF
							</Typography>
						</TableCell>
					</LargeTableHeadRow>
				</TableHead>
				<TableBody className={classes.tableBodyRow} />
			</Table>
		</Grid>
	);
};

export default injectSheet(styles)(TreatiesTable);
