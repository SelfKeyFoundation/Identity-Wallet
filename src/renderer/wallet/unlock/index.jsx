import React, { Component } from 'react';
import { Grid, Typography, Paper, Modal, Divider } from '@material-ui/core';
import {
	SelfkeyLogo,
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
	TrezorIcon
} from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import ExistingAddress from './existing-address';
import NewAddress from './new-address';
import PrivateKey from './private-key';
import Ledger from './ledger';
import Trezor from './trezor';

const styles = theme => ({
	logo: {
		width: '50px',
		height: '65px'
	},
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
		backgroundColor: 'transparent'
	},
	logoSection: {
		paddingBottom: '50px'
	},
	passwordScore: {
		width: '100%'
	},
	passwordInput: {
		width: '100%'
	},
	modalContentWrapper: {}
});

const gotBackHome = props => <Link to="/" {...props} />;

const unlockOptionStyle = theme => ({
	box: {
		maxWidth: '110px',
		minWidth: '110px',
		minHeight: '88px',
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
		marginTop: '10px'
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
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				className={classes.grid}
			>
				<Grid item>{icon}</Grid>
				<Grid item>
					<Typography variant="body1" className={classes.body1}>
						{title}
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body2" className={classes.body2}>
						{subtitle}
					</Typography>
				</Grid>
			</Grid>
		</Paper>
	);
};

const UnlockOptionWrapped = withStyles(unlockOptionStyle)(UnlockOption);

class Unlock extends Component {
	state = {
		selected: 0
	};

	componentDidMount() {
		this.props.dispatch(push('/unlockWallet/existingAddress'));
	}

	switchUnlockOptions = (href, index) => event => {
		this.setState({ selected: index });
		this.props.dispatch(push(href));
	};

	render() {
		const { classes, match } = this.props;
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
						<Grid item>
							<SelfkeyLogo className={classes.logo} />
						</Grid>
						<Grid item>
							<Typography variant="h1">SELFKEY</Typography>
						</Grid>
					</Grid>
					<Paper className={classes.modalContentWrapper}>
						<ModalCloseButton component={gotBackHome}>
							<ModalCloseIcon />
						</ModalCloseButton>

						<ModalHeader>
							<Typography variant="h3" id="modal-title">
								Use An Existing ETH Address
							</Typography>
						</ModalHeader>

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
										spacing={32}
									>
										<Grid item>
											<UnlockOptionWrapped
												selected={this.state.selected === 0}
												icon={<ExistingAddressIcon />}
												title="Existing Address"
												subtitle="Keystore File"
												onClick={this.switchUnlockOptions(
													'/unlockWallet/existingAddress',
													0
												)}
											/>
										</Grid>
										<Grid item>
											<UnlockOptionWrapped
												selected={this.state.selected === 1}
												icon={<NewAddressIcon />}
												title="New Address"
												subtitle="Keystore File"
												onClick={this.switchUnlockOptions(
													'/unlockWallet/newAddress',
													1
												)}
											/>
										</Grid>
										<Grid item>
											<UnlockOptionWrapped
												selected={this.state.selected === 2}
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
												selected={this.state.selected === 3}
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
												selected={this.state.selected === 4}
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
								<Divider />
								<Grid item>
									<Route
										path={`${match.path}/existingAddress`}
										component={ExistingAddress}
									/>
									<Route
										path={`${match.path}/newAddress`}
										component={NewAddress}
									/>
									<Route
										path={`${match.path}/privateKey`}
										component={PrivateKey}
									/>
									<Route path={`${match.path}/ledger`} component={Ledger} />
									<Route path={`${match.path}/trezor`} component={Trezor} />
								</Grid>
							</Grid>
						</ModalBody>
					</Paper>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Unlock));
