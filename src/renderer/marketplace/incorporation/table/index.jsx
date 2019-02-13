import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LargeTableHeadRow, TagTableCell, Tag, IncorporationsIcon } from 'selfkey-ui';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import FlagCountryName from '../common/flag-country-name';
import ProgramPrice from '../common/program-price';

const styles = theme => ({
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
		width: '35px'
	},
	flagCell: {
		width: '10px'
	},
	regionCell: {
		width: '60px'
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
});

class IncorporationsTable extends Component {
	componentDidMount() {
		if (!this.props.incorporations || !this.props.incorporations.length) {
			this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}
	}

	_renderLoadingScreen = () => (
		<Grid container justify="center" alignItems="center">
			<CircularProgress size={50} className={this.props.classes.loading} />
		</Grid>
	);

	render() {
		const { classes, isLoading, incorporations, keyRate } = this.props;
		if (isLoading) {
			return this._renderLoadingScreen();
		}
		const data = incorporations.filter(program => Object.keys(program.tax).length !== 0);

		return (
			<div>
				<Grid item id="header" className={classes.header} xs={12}>
					<IncorporationsIcon />
					<Typography variant="h1" gutterBottom className={classes.headerTitle}>
						Incorporation Marketplace
					</Typography>
				</Grid>
				<Grid container direction="row" justify="space-evenly" alignItems="center">
					<Table className={classes.table}>
						<TableHead>
							<LargeTableHeadRow>
								<TableCell className={classes.flagCell} />
								<TableCell>
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
										Offshore Tax
									</Typography>
								</TableCell>
								<TableCell className={classes.smallCell}>
									<Typography variant="overline" gutterBottom>
										Corp Tax
									</Typography>
								</TableCell>
								<TableCell className={classes.goodForCell}>
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
										<FlagCountryName code={inc['Country code']} />
									</TableCell>
									<TableCell>{inc.Region}</TableCell>
									<TableCell className={classes.regionCell}>
										{inc.Acronym}
									</TableCell>
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
										<ProgramPrice price={inc['Wallet Price']} rate={keyRate} />
									</TableCell>
									<TableCell className={classes.detailsCell}>
										<span
											onClick={() =>
												this.props.onDetailClick(
													inc['Company code'],
													inc['Country code']
												)
											}
										>
											Details
										</span>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Grid>
			</div>
		);
	}
}

IncorporationsTable.propTypes = {
	incorporations: PropTypes.array,
	isLoading: PropTypes.bool
};

const mapStateToProps = (state, props) => {
	return {
		incorporations: incorporationsSelectors.getMainIncorporationsWithTaxes(state),
		isLoading: incorporationsSelectors.getLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(IncorporationsTable);
export default connect(mapStateToProps)(styledComponent);
