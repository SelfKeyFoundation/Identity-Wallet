import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import { FlagCountryName } from './';

const styles = theme => ({
	container: {
		width: '100%',
		margin: '50px auto 0',
		maxWidth: '960px'
	},
	backButtonContainer: {
		left: '15px',
		position: 'absolute'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px'
	},
	bold: {
		fontWeight: 600
	},
	title: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: '1em',
			marginTop: '0.25em',
			marginBottom: '0',
			fontSize: '24px'
		}
	}
});

export const DetailsPageLayout = withStyles(styles)(props => {
	const { classes, children, onBack, title, countryCode } = props;
	return (
		<Grid container>
			<Grid item>
				<div className={classes.backButtonContainer}>
					<Button variant="outlined" color="secondary" size="small" onClick={onBack}>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
			</Grid>
			<Grid item className={classes.container}>
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.title}
				>
					<div>
						<FlagCountryName code={countryCode} />
					</div>
					<Typography variant="body2" gutterBottom className="region">
						{title}
					</Typography>
				</Grid>
				<Grid container className={classes.contentContainer}>
					{children}
				</Grid>
			</Grid>
		</Grid>
	);
});

export default DetailsPageLayout;
