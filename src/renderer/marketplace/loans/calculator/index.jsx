import React from 'react';
import { PageLoading } from '../../common';
import { Button, Typography, Grid, withStyles } from '@material-ui/core';
/*
import { LoanIcon } from 'selfkey-ui';
import { LoansCalculatorCard } from '../common/calculator-card';
import { LoansTabs } from './tabs';
*/

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
