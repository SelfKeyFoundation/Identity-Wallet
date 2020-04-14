import React, { PureComponent } from 'react';
import { CardContent, Card, Grid, Typography, Button, withStyles } from '@material-ui/core';
import { DIDIcon } from 'selfkey-ui';

const styles = theme => ({
	title: {
		marginBottom: '.5em'
	},
	info: {
		padding: '25px 30px'
	},
	buttons: {
		marginTop: '20px'
	},
	extraSpace: {
		marginRight: '4px'
	}
});

class LoansCalculatorCardComponent extends PureComponent {
	render() {
		const { classes, onCalculatorClick } = this.props;
		return (
			<Card>
				<CardContent>
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="center"
						spacing={24}
					>
						<Grid container item spacing={0} justify="space-between">
							<Grid
								container
								xs={2}
								justify="end"
								alignItems="center"
								direction="column"
								wrap="nowrap"
								spacing={24}
								className={classes.info}
							>
								<Grid item>
									<DIDIcon />
								</Grid>

								<Grid item>
									<Typography variant="subtitle2" color="secondary" />
								</Grid>
							</Grid>

							<Grid item xs={10}>
								<Typography variant="h1" className={classes.title}>
									Loan Calculator
								</Typography>
								<Typography variant="body1" color="secondary">
									Know exactly the collateral amount needed to get a loan and the
									total cost of it. No more unanswered questions.
								</Typography>
								<Grid container spacing={16} className={classes.buttons}>
									<Grid item className={classes.extraSpace}>
										<Button
											variant="contained"
											onClick={onCalculatorClick}
											size="large"
										>
											Calculate My Loan
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		);
	}
}

export const LoansCalculatorCard = withStyles(styles)(LoansCalculatorCardComponent);
export default LoansCalculatorCard;
