import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	howItWorksBox: {
		width: '30%',
		padding: '2em 3%',
		margin: '2em 0',
		color: '#FFF',
		background: '#313D49',
		'& header h4': {
			display: 'inline-block',
			marginLeft: '0.5em',
			fontSize: '16px'
		},
		'& header span': {
			color: '#00C0D9',
			fontWeight: 'bold',
			fontSize: '20px'
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
							<Typography variant="h4" gutterBottom>
								Provide initial documents
							</Typography>
						</header>
						<div>
							<Typography variant="h3" gutterBottom>
								{initialDocsText}
							</Typography>
						</div>
					</div>
					<div className={classes.howItWorksBox}>
						<header>
							<span>2</span>
							<Typography variant="h4" gutterBottom>
								KYC Process
							</Typography>
						</header>
						<div>
							<Typography variant="h3" gutterBottom>
								{kycProcessText}
							</Typography>
						</div>
					</div>
					<div className={classes.howItWorksBox}>
						<header>
							<span>3</span>
							<Typography variant="h4" gutterBottom>
								Get final documents
							</Typography>
						</header>
						<div>
							<Typography variant="h3" gutterBottom>
								{getFinalDocsText}
							</Typography>
						</div>
					</div>
				</Grid>
			</div>
		);
	}
);

export { HowServiceWorks };
export default HowServiceWorks;
