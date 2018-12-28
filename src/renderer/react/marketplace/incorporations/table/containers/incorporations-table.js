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
import { TableHeader, LargeTableHeadRow, TableText, TagTableCell, Tag } from 'selfkey-ui';

import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import FlagCountryName from '../../common/flag-country-name';
// import TagList from '../../common/tag-list';
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
		width: '15px'
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

		const { Main, Taxes } = this.props.data;
		console.log(Taxes);

		return (
			<Grid container direction="row" justify="space-evenly" alignItems="center">
				<Table className={classes.table}>
					<TableHead>
						<LargeTableHeadRow>
							<TableCell className={classes.flagCell} />
							<TableCell>
								<TableHeader>Jurisdiction</TableHeader>
							</TableCell>
							<TableCell className={classes.regionCell}>
								<TableHeader>Entity</TableHeader>
							</TableCell>
							<TableCell className={classes.smallCell}>
								<TableHeader>Offshore Tax</TableHeader>
							</TableCell>
							<TableCell className={classes.smallCell}>
								<TableHeader>Corp Tax</TableHeader>
							</TableCell>
							<TableCell className={classes.goodForCell}>
								<TableHeader>Good for</TableHeader>
							</TableCell>
							<TableCell className={classes.costCell}>
								<TableHeader>Cost</TableHeader>
							</TableCell>
							<TableCell className={classes.detailsCell} />
						</LargeTableHeadRow>
					</TableHead>
					<TableBody className={classes.tableBodyRow}>
						{Main.map(d => (
							<TableRow key={d.id}>
								<TableCell className={classes.flagCell}>
									<FlagCountryName code={d.data.fields[`Country code`]} />
								</TableCell>
								<TableCell>
									<TableText>{d.data.fields.Region}</TableText>
								</TableCell>
								<TableCell className={classes.regionCell}>
									<TableText>{d.data.fields.Acronym}</TableText>
								</TableCell>
								<TableCell className={classes.smallCell}>
									<TableText>
										{getTaxFieldForCompanyCode(
											Taxes,
											d.data.fields['Company code'],
											'Offshore Income Tax Rate'
										)}
									</TableText>
								</TableCell>
								<TableCell className={classes.smallCell}>
									<TableText>
										{getTaxFieldForCompanyCode(
											Taxes,
											d.data.fields['Company code'],
											'Corporate Tax Rate'
										)}
									</TableText>
								</TableCell>
								<TagTableCell className={classes.goodForCell}>
									{d.data.fields[`Good for`] &&
										d.data.fields[`Good for`].map(tag => (
											<Tag key={tag}>{tag}</Tag>
										))}
								</TagTableCell>
								<TableCell className={classes.costCell}>
									<TableText>
										<ProgramPrice price={d.data.fields.Price} />
									</TableText>
								</TableCell>
								<TableCell className={classes.detailsCell}>
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
