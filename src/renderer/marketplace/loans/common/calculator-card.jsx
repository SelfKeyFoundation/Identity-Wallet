import React, { PureComponent } from 'react';
import { CardContent, Card, Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CalculatorIcon, ModalCloseIcon } from 'selfkey-ui';

const styles = theme => ({
	card: {
		marginBottom: '24px'
	},
	container: {
		padding: '30px 24px 60px !important',
		position: 'relative'
	},
	closeIcon: {
		position: 'absolute',
		right: '10px',
		top: '10px',
		width: '30px',
		cursor: 'pointer'
	},
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
	},
	calculatorIcon: {
		padding: '0 24px 24px',
		marginRight: '24px'
	}
});

class LoansCalculatorCardComponent extends PureComponent {
	render() {
		const { classes, onCalculatorClick, onClose } = this.props;
		return (
			<Card className={classes.card}>
				<CardContent className={classes.container}>
					<ModalCloseIcon className={classes.closeIcon} onClick={onClose} />
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="flex-start"
						spacing={24}
					>
						<div style={{ display: 'flex' }}>
							<div className={classes.calculatorIcon}>
								<CalculatorIcon />
							</div>
							<div>
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
							</div>
						</div>
					</Grid>
				</CardContent>
			</Card>
		);
	}
}

export const LoansCalculatorCard = withStyles(styles)(LoansCalculatorCardComponent);
export default LoansCalculatorCard;
