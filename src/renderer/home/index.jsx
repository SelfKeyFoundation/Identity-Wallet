import React, { Component } from 'react';
import { Grid, Typography, Paper, Button } from '@material-ui/core';
import { primary, HelpIcon, QuitIcon, SelfkeyLogoTemp } from 'selfkey-ui';
import { tokensOperations } from 'common/tokens';
import backgroundImage from '../../../static/assets/images/bgs/background.jpg';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PaymentConfirmationPopup from '../marketplace/incorporation/pay/payment-confirmation-popup';

const styles = theme => ({
	container: {
		backgroundImage: `url(${backgroundImage})`,
		minHeight: '100vh'
	},
	parentGrid: {
		minHeight: '100vh'
	},
	primaryTintText: {
		color: primary
	},
	icon: {
		width: '36px',
		height: '36px'
	},
	footerButton: {
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor: 'transparent'
		}
	},
	divider: {
		background: 'linear-gradient(to bottom, #142a34 0%, #00c0d9 100%)',
		height: '120px',
		marginTop: '-80px',
		position: 'absolute',
		width: '1px'
	},
	footerQuit: {
		marginLeft: '-50px',
		marginTop: '-50px'
	},
	footerHelp: {
		marginLeft: '50px',
		marginTop: '-50px'
	}
});

const createWalletLink = props => <Link to="/createWallet" {...props} />;
const unlockWalletLink = props => <Link to="/unlockWallet" {...props} />;
class Home extends Component {
	componentDidMount() {
		this.props.dispatch(tokensOperations.loadTokensOperation());
	}
	render() {
		const { classes } = this.props;
		return (
			<Paper className={classes.container} square={true}>
				<Grid
					container
					direction="column"
					justify="space-between"
					alignItems="center"
					spacing={40}
					className={classes.parentGrid}
				>
					<Grid
						container
						item
						direction="column"
						justify="center"
						alignItems="center"
						spacing={40}
						style={{ flexGrow: 1 }}
					>
						<Grid
							container
							item
							direction="column"
							justify="flex-start"
							alignItems="center"
							spacing={8}
						>
							<Grid item>
								<PaymentConfirmationPopup />
							</Grid>
							<Grid item>
								<SelfkeyLogoTemp />
							</Grid>
							<Grid item>
								<Typography variant="h2" className={classes.primaryTintText}>
									IDENTITY WALLET
								</Typography>
							</Grid>
						</Grid>
						<Grid
							container
							item
							direction="column"
							justify="flex-end"
							alignItems="center"
							spacing={32}
						>
							<Grid item>
								<Button
									variant="contained"
									component={createWalletLink}
									size="large"
								>
									CREATE NEW WALLET
								</Button>
							</Grid>
							<Grid item>
								<Button
									variant="outlined"
									component={unlockWalletLink}
									size="large"
								>
									USE EXISTING WALLET
								</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid
						container
						item
						direction="row"
						justify="center"
						alignItems="flex-end"
						spacing={24}
					>
						<Grid item>
							<Button
								color="primary"
								size="medium"
								onClick={e => {
									window.openExternal(e, 'https://help.selfkey.org/');
								}}
								className={classes.footerButton}
							>
								<Grid
									container
									direction="column"
									justify="center"
									alignItems="center"
									className={classes.footerHelp}
								>
									<Grid item>
										<HelpIcon className={classes.icon} />
									</Grid>
									<Grid item>HELP</Grid>
								</Grid>
							</Button>
						</Grid>
						<Grid item>
							<div className={classes.divider} />
						</Grid>
						<Grid item>
							<Button
								color="primary"
								size="medium"
								onClick={window.quit}
								className={classes.footerButton}
							>
								<Grid
									container
									direction="column"
									justify="center"
									alignItems="center"
									className={classes.footerQuit}
								>
									<Grid item>
										<QuitIcon className={classes.icon} />
									</Grid>
									<Grid item>QUIT</Grid>
								</Grid>
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		);
	}
}

export default connect()(withStyles(styles)(Home));
