import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

import { Grid } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import FlagCountryName from '../../common/flag-country-name';
import TagList from '../../common/tag-list';
import ProgramPrice from '../../common/program-price';
import { getTaxFieldForCompanyCode } from '../../common/data-operations';

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
		tableLayout: 'fixed',
		'& tbody tr:nth-child(odd)': {
			background: '#2E3945'
		}
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
		'& td': {
			fontFamily: 'Lato, arial, sans-serif',
			border: 'none',
			fontSize: '15px',
			color: '#FFFFFF'
		},
		'& tMain.details': {
			color: '#00C0D9'
		},
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
	goodFor: {
		width: '220px'
	},
	loading: {
		marginTop: '5em'
	}
};

class IncorporationsTable extends Component {
	componentDidMount() {
		if (!this.props.data) {
			this.props.dispatch(incorporationsOperations.loadData());
		}
	}

	_renderLoadingScreen = () => (
		<Grid container justify="center" alignItems="center">
			<CircularProgress size={50} className={this.props.classes.loading} />
		</Grid>
	);

	render() {
		const classes = this.props.classes;

		if (!this.props.data) {
			return this._renderLoadingScreen();
		}

		console.log(this.props.data);
		const { Main, Taxes } = this.props.data;

		return (
			<Grid container direction="row" justify="space-evenly" alignItems="center">
				<Table className={classes.table}>
					<TableHead>
						<TableRow className={classes.tableHeaderRow}>
							<TableCell>&nbsp;</TableCell>
							<TableCell style={{ width: '130px', paddingLeft: '0px' }}>
								Jurisdiction
							</TableCell>
							<TableCell>Entity</TableCell>
							<TableCell>Offshore Tax</TableCell>
							<TableCell>Corp Tax</TableCell>
							<TableCell style={{ width: '350px' }}>Good for</TableCell>
							<TableCell>Cost</TableCell>
							<TableCell>&nbsp;</TableCell>
						</TableRow>
					</TableHead>
					<TableBody className={classes.tableBodyRow}>
						{Main.map(d => (
							<TableRow key={d.id}>
								<TableCell>
									<FlagCountryName code={d.data.fields[`Country code`]} />
								</TableCell>
								<TableCell style={{ width: '130px', paddingLeft: '0px' }}>
									{d.data.fields.Region}
								</TableCell>
								<TableCell style={{ width: '100px', paddingLeft: '0px' }}>
									{d.data.fields.Acronym}
								</TableCell>
								<TableCell>
									{getTaxFieldForCompanyCode(
										Taxes,
										d.data.fields['Company code'],
										'Offshore Income Tax Rate'
									)}
								</TableCell>
								<TableCell>{Math.floor(Math.random() * 30) + 1}%</TableCell>
								<TableCell style={{ width: '350px' }}>
									<TagList categories={d.data.fields[`Good for`]} />
								</TableCell>
								<TableCell>
									<ProgramPrice price={d.data.fields.Price} />
								</TableCell>
								<TableCell className="details">
									<span onClick={() => this.props.onDetailClick(d.data.fields)}>
										Details
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Grid>
		);
	}
}

IncorporationsTable.propTypes = {
	data: PropTypes.object
};

const mapStateToProps = (state, props) => {
	return {
		data: incorporationsSelectors.getData(state)
	};
};

/*
const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => {
		dispatch(getChannel(ownProps.channelString));
	}
});
*/

export default connect(mapStateToProps)(injectSheet(styles)(IncorporationsTable));
