import React from 'react';
import { Typography, Grid, List, ListItem } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { PageLoading, sanitize } from '../../common';
import 'flag-icon-css/css/flag-icon.css';
import { primary } from 'selfkey-ui';

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
	},
	tabContainer: {
		width: '100%',
		padding: theme.spacing(4, 0),
		color: '#FFFFFF',
		'& p': {
			marginBottom: theme.spacing(3),
			lineHeight: '1.4em'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: theme.spacing(0),
			marginBottom: theme.spacing(1),
			marginTop: theme.spacing(0)
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: theme.spacing(3),
			marginBottom: theme.spacing(3)
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: theme.spacing(1)
		},
		'& a': {
			color: primary
		}
	}
});

export const IncorporationsCountryTab = withStyles(styles)(({ classes, country, program }) => (
	<div className={classes.tabContainer}>
		{!country && <PageLoading />}
		{!!country && (
			<React.Fragment>
				<Typography variant="h1" className={classes.countryName}>
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
				{program && (
					<div className={classes.countryInfo}>
						<div
							dangerouslySetInnerHTML={{
								__html: sanitize(
									program.data.en
										? program.data.en.countryDetails
										: program.data.countryDescription
								)
							}}
						/>
					</div>
				)}
			</React.Fragment>
		)}
	</div>
));

export default IncorporationsCountryTab;
