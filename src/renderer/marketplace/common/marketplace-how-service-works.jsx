import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	howItWorksBox: {
		background: '#313D49',
		color: '#FFF',
		margin: theme.spacing(2, 0),
		padding: '2em 3%',
		width: '30%',
		'& header h4': {
			display: 'inline-block',
			fontSize: '16px',
			marginBottom: theme.spacing(2),
			marginLeft: theme.spacing(1)
		},
		'& header span': {
			color: '#00C0D9',
			fontSize: '20px',
			fontWeight: 'bold'
		},
		'& h3': {
			fontSize: '13px'
		}
	}
});

const HowServiceWorks = withStyles(styles)(
	({ classes, initialDocsText, kycProcessText, getFinalDocsText }) => {
		return (
			<div>
				<Typography variant="h2">How the service works</Typography>
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="center"
					spacing={0}
				>
					<div className={classes.howItWorksBox}>
						<header>
							<span>1</span>
							<Typography variant="h4">Provide initial documents</Typography>
						</header>
						<div>
							<Typography variant="h3">{initialDocsText}</Typography>
						</div>
					</div>
					<div className={classes.howItWorksBox}>
						<header>
							<span>2</span>
							<Typography variant="h4">KYC Process</Typography>
						</header>
						<div>
							<Typography variant="h3">{kycProcessText}</Typography>
						</div>
					</div>
					<div className={classes.howItWorksBox}>
						<header>
							<span>3</span>
							<Typography variant="h4">Get final documents</Typography>
						</header>
						<div>
							<Typography variant="h3">{getFinalDocsText}</Typography>
						</div>
					</div>
				</Grid>
			</div>
		);
	}
);

export { HowServiceWorks };
export default HowServiceWorks;
