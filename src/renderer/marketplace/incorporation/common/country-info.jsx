import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, List, ListItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { incorporationsSelectors, incorporationsOperations } from 'common/incorporations';
import { sanitize } from '../../common';
import 'flag-icon-css/css/flag-icon.css';

const styles = theme => ({
	countryName: {
		textAlign: 'center',
		marginBottom: theme.spacing(4)
	},
	details: {
		width: '50%',
		marginLeft: theme.spacing(0),
		'& h5': {
			fontWeight: 'normal',
			display: 'inline-block',
			fontSize: '14px'
		},
		'& div': {
			display: 'inline-block'
		},
		'& h5.value': {
			color: '#93B0C1',
			marginLeft: theme.spacing(2),
			fontWeight: 'bold'
		}
	},
	countryInfo: {
		marginTop: theme.spacing(6)
	},
	flag: {
		width: '45%',
		'& span': {
			float: 'right'
		}
	}
});

/* ==========================================================================
   Received props:
   ---------------
   countryCode: country two letter code
   country: data from api, returned from redux store
   isLoading: still loading data
   ==========================================================================
*/

class IncorporationsCountryInfo extends PureComponent {
	componentDidMount() {
		if (!this.props.country) {
			this.props.dispatch(
				incorporationsOperations.loadIncorporationsCountryOperation(this.props.countryCode)
			);
		}
	}

	renderLoadingScreen = () => (
		<Grid container justify="center" alignItems="center">
			<CircularProgress size={50} className={this.props.classes.loading} />
		</Grid>
	);

	render() {
		const { country, classes, translation } = this.props;

		if (!country) {
			return this.renderLoadingScreen();
		}

		return (
			<div>
				<Typography variant="h1" gutterBottom className={classes.countryName}>
					{country.name}
				</Typography>
				<Grid container justify="flex-start" alignItems="flex-start">
					<div className={classes.details}>
						<List>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Country Code
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country.code}
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Area
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country.areaInSqKm} km&sup2;
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Capital
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country.capital}
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Continent
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country.continentName}
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Currency
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country.currencyCode}
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Population
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country.population}
								</Typography>
							</ListItem>
						</List>
					</div>
					<div className={classes.flag}>
						<span
							style={{ display: 'block', fontSize: '200px' }}
							className={`flag-icon flag-icon-${country.code.toLowerCase()}`}
						/>
					</div>
				</Grid>
				<div className={classes.countryInfo}>
					<div
						dangerouslySetInnerHTML={{
							__html: sanitize(translation.country_details)
						}}
					/>
				</div>
			</div>
		);
	}
}

IncorporationsCountryInfo.propTypes = {
	countryCode: PropTypes.string,
	isLoading: PropTypes.bool,
	country: PropTypes.object
};

const mapStateToProps = (state, props) => {
	return {
		country: incorporationsSelectors.getCountry(state, props.countryCode),
		isLoading: incorporationsSelectors.getLoading(state)
	};
};

const styledComponent = withStyles(styles)(IncorporationsCountryInfo);
export default connect(mapStateToProps)(styledComponent);
