import React, { PureComponent } from 'react';
import { Grid, Typography, Paper, Divider } from '@material-ui/core';
import { appOperations, appSelectors } from 'common/app';
import { Subject as SubjectIcon } from '@material-ui/icons';
import { primaryTint, primary } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { Link, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import ExistingAddress from './existing-address';
import NewAddress from './new-address';
import PrivateKey from './private-key';
import SeedPhrase from './seed-phrase';
import Ledger from './ledger';
import Trezor from './trezor';
import { Popup } from '../../common';
import { featureIsEnabled } from 'common/feature-flags';

const styles = theme => ({
	divider: {
		backgroundColor: '#475768',
		marginBottom: '40px'
	},
	popup: {
		width: '960px'
	},
	unlockOptions: {
		margin: '10px 0 40px',
		maxWidth: 530
	},
	seedIcon: {
		marginTop: -10,
		marginBottom: -5
	}
});

const gotBackHome = React.forwardRef((props, ref) => <Link to="/home" {...props} ref={ref} />);

const unlockOptionStyle = theme => ({
	box: {
		backgroundColor: '#1B2229',
		boxShadow: 'none',
		borderColor: '#1D505F',
		display: 'flex',
		maxWidth: '160px',
		minWidth: '160px',
		minHeight: '128px',
		cursor: 'pointer',
		'&:hover': {
			borderColor: primaryTint
		},
		'& svg': {
			width: 40,
			height: 40,
			color: primary
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
		paddingTop: '25px'
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
			<Popup
				closeComponent={gotBackHome}
				open
				displayLogo
				text="Use An Existing ETH Address"
				popupClass={classes.popup}
			>
				{walletsLoading ? (
					<p>Loading...</p>
				) : (
					<Grid container direction="column" alignItems="center">
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							spacing={2}
							className={classes.unlockOptions}
						>
							{wallets.length ? (
								<Grid item>
									<UnlockOptionWrapped
										selected={selected === 0}
										icon={
											<img src="/assets/svg-icons/icon-existing-address.svg" />
										}
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
									icon={<img src="/assets/svg-icons/icon-import-address.svg" />}
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
									icon={<img src="/assets/svg-icons/icon-key.svg" />}
									title="Private Key"
									onClick={this.switchUnlockOptions(
										'/unlockWallet/privateKey',
										2
									)}
								/>
							</Grid>

							{featureIsEnabled('hdWallet') && (
								<Grid item id="privateKey">
									<UnlockOptionWrapped
										selected={selected === 5}
										icon={<SubjectIcon className={classes.seedIcon} />}
										title="Seed Phrase"
										onClick={this.switchUnlockOptions(
											'/unlockWallet/seedPhrase',
											5
										)}
									/>
								</Grid>
							)}

							<Grid item>
								<UnlockOptionWrapped
									selected={selected === 3}
									icon={<img src="/assets/svg-icons/icon-ledger.svg" />}
									title="Ledger"
									onClick={this.switchUnlockOptions('/unlockWallet/ledger', 3)}
								/>
							</Grid>
							<Grid item>
								<UnlockOptionWrapped
									selected={selected === 4}
									icon={<img src="/assets/svg-icons/icon-trezor.svg" />}
									title="Trezor"
									onClick={this.switchUnlockOptions('/unlockWallet/trezor', 4)}
								/>
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
								<Route path={`${match.path}/newAddress`} component={NewAddress} />
								<Route path={`${match.path}/privateKey`} component={PrivateKey} />
								<Route path={`${match.path}/ledger`} component={Ledger} />
								<Route path={`${match.path}/trezor`} component={Trezor} />
								<Route path={`${match.path}/seedPhrase`} component={SeedPhrase} />
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
				)}
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		app: appSelectors.selectApp(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Unlock));
