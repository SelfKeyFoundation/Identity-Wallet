import React, { PureComponent } from 'react';
import { CardContent, Card, Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CalculatorIcon, ModalCloseIcon } from 'selfkey-ui';

const styles = theme => ({
	card: {
		marginBottom: theme.spacing(3)
	},
	container: {
		padding: '32px 24px 56px !important',
		position: 'relative'
	},
	closeIcon: {
		cursor: 'pointer',
		position: 'absolute',
		right: '10px',
		top: '10px',
		width: '30px'
	},
	title: {
		marginBottom: theme.spacing(1)
	},
	info: {
		padding: theme.spacing(3, 4)
	},
	buttons: {
		marginTop: theme.spacing(4)
	},
	extraSpace: {
		marginRight: theme.spacing(1)
	},
	calculatorIcon: {
		marginRight: theme.spacing(3),
		padding: theme.spacing(0, 3, 3)
	}
});

class LoansCalculatorCardComponent extends PureComponent {
	render() {
		const { classes, onCalculatorClick, onClose } = this.props;
		return (
			<Card className={classes.card}>
				<CardContent className={classes.container}>
					<ModalCloseIcon className={classes.closeIcon} onClick={onClose} />
					<Grid container direction="column" justify="center" alignItems="flex-start">
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
								<Grid container className={classes.buttons}>
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
