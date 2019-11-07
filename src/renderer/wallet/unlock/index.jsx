import React, { PureComponent } from 'react';
import { Grid, Typography, Paper, Modal, Divider } from '@material-ui/core';
import { appOperations, appSelectors } from 'common/app';
import {
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	ExistingAddressIcon,
	primaryTint,
	NewAddressIcon,
	KeyIcon,
	LedgerIcon,
	TrezorIcon,
	SelfkeyLogoTemp
} from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { Link, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import ExistingAddress from './existing-address';
import NewAddress from './new-address';
import PrivateKey from './private-key';
import Ledger from './ledger';
import Trezor from './trezor';

const styles = theme => ({
	container: {
		minHeight: '100vh'
	},
	parentGrid: {
		minHeight: '100vh'
	},
	passwordIcon: {
		width: '66px',
		height: '76px'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent',
		top: '100px'
	},
	logoSection: {
		paddingBottom: '70px'
	},
	passwordScore: {
		width: '100%'
	},
	passwordInput: {
		width: '100%'
	},
	hr: {
		backgroundColor: '#475768',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px',
		width: '100%'
	},
	divider: {
		backgroundColor: '#475768',
		marginBottom: '15px',
		width: 'calc(100% - 50px)'
	},
	closeIcon: {
		marginTop: '20px'
	}
});

const gotBackHome = props => <Link to="/home" {...props} />;

const unlockOptionStyle = theme => ({
	box: {
		backgroundColor: '#293743',
		boxShadow: 'none',
		borderColor: '#1D505F',
		display: 'flex',
		maxWidth: '133px',
		minWidth: '133px',
		minHeight: '110px',
		margin: '16px 5px',
		cursor: 'pointer',
		'&:hover': {
			borderColor: primaryTint
		}
	},
	body1: {
		fontSize: '10px'
	},
	body2: {
		fontSize: '9px',
		lineHeight: '0px'
	},
	grid: {
		marginBottom: '10px',
		paddingTop: '20px'
	},
	selected: {
		borderColor: primaryTint
	}
});

const UnlockOption = props => {
	const { classes, onClick, icon, title, subtitle, selected } = props;
	const selectedClass = selected ? `${classes.box} ${classes.selected}` : classes.box;
	return (
		<Paper className={selectedClass} onClick={onClick}>
			<Grid container direction="column" justify="flex-start" alignItems="center">
				<Grid item className={classes.grid}>
					{icon}
				</Grid>
				<Grid container direction="column" justify="center" alignItems="center">
					<Grid item>
						<Typography variant="body2">{title}</Typography>
					</Grid>
					<Grid item>
						<Typography variant="subtitle2" color="secondary" gutterBottom>
							{subtitle}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	);
};

const UnlockOptionWrapped = withStyles(unlockOptionStyle)(UnlockOption);

class Unlock extends PureComponent {
	state = {
		selected: 0
	};

	componentDidMount() {
		this.props.dispatch(appOperations.loadWalletsOperation());
	}

	componentDidUpdate(prevProps) {
		if (prevProps.app !== this.props.app) {
			const { wallets } = this.props.app;
			let { selected } = this.state;
			if (!wallets.length && !selected) {
				this.setState({ selected: 1 });
			}
		}
	}

	switchUnlockOptions = (href, index) => event => {
		let location = this.props.location;
		let currentPath = location ? location['pathname'] || '' : '';
		this.setState({ selected: index });
		if (href !== currentPath) {
			this.props.dispatch(push(href));
		}
	};

	render() {
		const { classes, match, app } = this.props;
		const { walletsLoading, wallets } = app;
		let { selected } = this.state;
		return (
			<Modal open={true}>
				<ModalWrap className={classes.modalWrap}>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="center"
						spacing={8}
						className={classes.logoSection}
					>
						<SelfkeyLogoTemp />
					</Grid>
					<Paper className={classes.modalContentWrapper}>
						<ModalCloseButton component={gotBackHome}>
							<ModalCloseIcon className={classes.closeIcon} />
						</ModalCloseButton>

						<ModalHeader>
							<Typography variant="h2" color="textPrimary" id="modal-title">
								Use An Existing ETH Address
							</Typography>
						</ModalHeader>

						{walletsLoading ? (
							<ModalBody>Loading...</ModalBody>
						) : (
							<ModalBody>
								<Grid
									container
									direction="column"
									justify="center"
									alignItems="center"
									spacing={40}
								>
									<Grid item>
										<Grid
											container
											direction="row"
											justify="center"
											alignItems="center"
										>
											{wallets.length ? (
												<Grid item>
													<UnlockOptionWrapped
														selected={selected === 0}
														icon={<ExistingAddressIcon />}
														title="Existing Address"
														subtitle="Keystore File"
														onClick={this.switchUnlockOptions(
															'/unlockWallet/existingAddress',
															0
														)}
													/>
												</Grid>
											) : (
												''
											)}
											<Grid item>
												<UnlockOptionWrapped
													selected={selected === 1}
													icon={<NewAddressIcon />}
													title="New Address"
													subtitle="Keystore File"
													onClick={this.switchUnlockOptions(
														'/unlockWallet/newAddress',
														1
													)}
												/>
											</Grid>

											<Grid item id="privateKey">
												<UnlockOptionWrapped
													selected={selected === 2}
													icon={<KeyIcon />}
													title="Private Key"
													onClick={this.switchUnlockOptions(
														'/unlockWallet/privateKey',
														2
													)}
												/>
											</Grid>

											<Grid item>
												<UnlockOptionWrapped
													selected={selected === 3}
													icon={<LedgerIcon />}
													title="Ledger"
													onClick={this.switchUnlockOptions(
														'/unlockWallet/ledger',
														3
													)}
												/>
											</Grid>
											<Grid item>
												<UnlockOptionWrapped
													selected={selected === 4}
													icon={<TrezorIcon />}
													title="Trezor"
													onClick={this.switchUnlockOptions(
														'/unlockWallet/trezor',
														4
													)}
												/>
											</Grid>
										</Grid>
									</Grid>
									<Divider className={classes.divider} />
									<Grid item>
										<Switch>
											{wallets.length ? (
												<Route
													path={`${match.path}/existingAddress`}
													component={ExistingAddress}
												/>
											) : (
												''
											)}
											<Route
												path={`${match.path}/newAddress`}
												component={NewAddress}
											/>
											<Route
												path={`${match.path}/privateKey`}
												component={PrivateKey}
											/>
											<Route
												path={`${match.path}/ledger`}
												component={Ledger}
											/>
											<Route
												path={`${match.path}/trezor`}
												component={Trezor}
											/>
											<Redirect
												from={`${match.path}/`}
												to={
													wallets.length
														? `${match.path}/existingAddress`
														: `${match.path}/newAddress`
												}
											/>
										</Switch>
									</Grid>
								</Grid>
							</ModalBody>
						)}
					</Paper>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		app: appSelectors.selectApp(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Unlock));
