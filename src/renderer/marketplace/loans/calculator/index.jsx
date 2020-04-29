import React from 'react';
import { PageLoading } from '../../common';
import { Button, Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	backButtonContainer: {
		left: '75px',
		position: 'absolute'
	}
});

const LoanCalculatorTab = withStyles(styles)(({ classes, loading, onBackClick }) => {
	return (
		<Grid container>
			<Grid item>
				<div className={classes.backButtonContainer}>
					<Button
						id="backToMarketplace"
						variant="outlined"
						color="secondary"
						size="small"
						onClick={onBackClick}
					>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
			</Grid>
			{loading && <PageLoading />}
		</Grid>
	);
});

export default LoanCalculatorTab;
export { LoanCalculatorTab };
