import React, { PureComponent } from 'react';
import { Grid, Typography, Paper, Button } from '@material-ui/core';
import { primary, HelpIcon, QuitIcon, SelfkeyLogoTemp } from 'selfkey-ui';
import { tokensOperations } from 'common/tokens';
import backgroundImage from '../../../static/assets/images/bgs/background.jpg';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { appOperations } from 'common/app';
import { getGlobalContext } from 'common/context';

const styles = theme => ({
	container: {
		backgroundImage: `url(${backgroundImage})`,
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		border: 'none',
		minHeight: '100vh'
	},
	parentGrid: {
		margin: 0,
		minHeight: '100vh',
		width: '100%'
	},
	insideGrid: {
		flexGrow: 1,
		margin: 0,
		width: '100%'
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
		marginTop: '-88px',
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
	},
	scrollFix: {
		margin: 0,
		width: '100%'
	}
});

const createWalletLink = React.forwardRef((props, ref) => (
	<Link to="/createWallet" {...props} ref={ref} />
));
const unlockWalletLink = React.forwardRef((props, ref) => (
	<Link to="/unlockWallet" {...props} ref={ref} />
));
class Home extends PureComponent {
	componentDidMount() {
		this.props.dispatch(appOperations.resetAppAction());
		this.props.dispatch(appOperations.loadWalletsOperation());
		this.props.dispatch(tokensOperations.loadTokensOperation());
	}
	createWalletClicked = () => {
		getGlobalContext().matomoService.trackEvent(
			'wallet_setup',
			'wallet_create_click',
			undefined,
			undefined,
			true
		);
	};
	render() {
		const { classes } = this.props;
		return (
			<Paper className={classes.container} square={true}>
				<Grid
					container
					direction="column"
					justify="space-between"
					alignItems="center"
					spacing={5}
					className={classes.parentGrid}
				>
					<Grid
						container
						item
						direction="column"
						justify="center"
						alignItems="center"
						spacing={5}
						className={classes.insideGrid}
					>
						<Grid
							container
							item
							direction="column"
							justify="flex-start"
							alignItems="center"
							spacing={1}
							className={classes.scrollFix}
						>
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
							spacing={4}
						>
							<Grid item>
								<Button
									id="createWallet"
									variant="contained"
									onClick={this.createWalletClicked}
									component={createWalletLink}
									size="large"
								>
									CREATE NEW WALLET
								</Button>
							</Grid>
							<Grid item>
								<Button
									id="useExistingWalletButton"
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
						spacing={3}
						className={classes.scrollFix}
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

const mapStateToProps = (state, props) => ({});

export default connect(mapStateToProps)(withStyles(styles)(Home));
