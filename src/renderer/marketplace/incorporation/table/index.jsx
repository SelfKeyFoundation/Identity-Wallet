import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import conf from 'common/config';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LargeTableHeadRow, TagTableCell, Tag, IncorporationsIcon } from 'selfkey-ui';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import { FlagCountryName, ProgramPrice } from '../common';

const styles = theme => ({
	header: {
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: '30px',
		marginBottom: '40px',
		marginTop: '50px'
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
		width: '10px'
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
	},
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
});

class IncorporationsTable extends Component {
	componentDidMount() {
		if (!this.props.incorporations || !this.props.incorporations.length) {
			this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}

		console.log(conf);
	}

	generateRoute({ countryCode, companyCode, templateID }) {
		let url = `${this.props.match.path}/details/${companyCode}/${countryCode}`;
		if (templateID) {
			url += `/${templateID}`;
		}
		return url;
	}

	onDetailsClick = ({ countryCode, companyCode, templateID }) =>
		this.props.dispatch(push(this.generateRoute({ countryCode, companyCode, templateID })));

	renderLoadingScreen = () => (
		<Grid container justify="center" alignItems="center">
			<CircularProgress size={50} className={this.props.classes.loading} />
		</Grid>
	);

	onBackClick = _ => this.props.dispatch(push('/main/marketplace-categories'));

	render() {
		const { classes, isLoading, incorporations, keyRate } = this.props;
		if (isLoading) {
			return this.renderLoadingScreen();
		}

		const data = incorporations.filter(program => program.show_in_wallet);

		return (
			<React.Fragment>
				<div className={classes.backButtonContainer}>
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						onClick={this.onBackClick}
					>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
				<Grid item id="header" className={classes.header} xs={12}>
					<IncorporationsIcon className={classes.icon} />
					<Typography variant="h1" className={classes.headerTitle}>
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
										Offsh Tax
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
											onClick={() => {
												console.log(inc, conf.dev);
												this.onDetailsClick({
													companyCode: inc['Company code'],
													countryCode: inc['Country code'],
													templateID: conf.dev
														? inc['test_template_id']
														: inc['template_id']
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
				</Grid>
			</React.Fragment>
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
