import React, { Component } from 'react';
import {
	CardContent,
	Card,
	CardHeader,
	Grid,
	Typography,
	Button,
	withStyles
} from '@material-ui/core';
import { DIDIcon } from 'selfkey-ui';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	info: {
		padding: '25px 30px'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	didButtons: {
		marginTop: '20px'
	},
	transaction: {
		alignItems: 'center',
		display: 'flex'
	},
	extraSpace: {
		marginRight: '4px'
	}
});

class RegisterDidCardComponent extends Component {
	render() {
		const { classes } = this.props;
		return (
			<Card>
				<CardHeader title="Decentralised ID" className={classes.regularText} />
				<hr className={classes.hr} />
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
								xs={3}
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
									<Typography variant="subtitle2" color="secondary">
										Register on the SelfKey Network to get your DID.
									</Typography>
								</Grid>
							</Grid>

							<Grid item xs={9}>
								<Typography variant="body1">
									Use a DID when accesing different services in the marketplace.
									Once created you’ll see it under your profile.
								</Typography>
								<br />
								<Typography variant="subtitle2" color="secondary">
									Getting a DID requires an Ethereum transaction. This is a one
									time only transaction.
								</Typography>
								<Grid container spacing={16} className={classes.didButtons}>
									<Grid item className={classes.extraSpace}>
										<Button
											disabled={this.props.pending}
											variant="contained"
											onClick={this.props.onRegisterDidClick}
											size="large"
										>
											GET DID
										</Button>
									</Grid>
									<Grid item>
										<Button
											disabled={this.props.pending}
											variant="outlined"
											onClick={this.props.onAssociateDidClick}
											size="large"
										>
											I HAVE ONE
										</Button>
									</Grid>
									{this.props.pending && (
										<Grid item className={classes.transaction}>
											<Typography variant="h3">
												Processing transaction..Please wait
											</Typography>
										</Grid>
									)}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		);
	}
}

export const RegisterDidCard = withStyles(styles)(RegisterDidCardComponent);

export default RegisterDidCard;
