import React, { Component } from 'react';
import { withStyles, Typography, Grid, List, ListItem } from '@material-ui/core';
import { PageLoading, sanitize } from '../../common';
import 'flag-icon-css/css/flag-icon.css';

const styles = theme => ({
	countryName: {
		textAlign: 'center',
		marginBottom: '2em'
	},
	details: {
		width: '50%',
		marginLeft: '0',
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
			marginLeft: '1em',
			fontWeight: 'bold'
		}
	},
	countryInfo: {
		marginTop: '50px'
	},
	flag: {
		width: '45%',
		'& span': {
			float: 'right'
		}
	}
});

class BankingCountryTabComponent extends Component {
	componentDidMount() {
		if (!this.props.country && this.props.loadCountryAction) {
			this.props.loadCountryAction(this.props.countryCode);
		}
	}
	render() {
		const { classes, country, translation } = this.props;
		return (
			<div className={classes.tabContainer}>
				{!country && <PageLoading />}
				{!!country && (
					<React.Fragment>
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
					</React.Fragment>
				)}
			</div>
		);
	}
}
export const BankingCountryTab = withStyles(styles)(BankingCountryTabComponent);

export default BankingCountryTab;
