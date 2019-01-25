import React, { Component } from 'react';
import {
	Avatar,
	Input,
	Button,
	Grid,
	Typography,
	Select,
	MenuItem,
	FormControl
} from '@material-ui/core';
import { baseLight } from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';
import { KeyboardArrowDown } from '@material-ui/icons';

const styles = theme => ({
	avatar: {
		width: '20px',
		height: '20px',
		fontSize: '12px',
		backgroundColor: baseLight
	},
	selectInput: {
		width: '100%'
	},
	passwordInput: {
		width: '205%'
	},
	menuItem: {
		display: 'flex'
	}
});

class ExistingAddress extends Component {
	state = {
		wallet: -1,
		password: '',
		error: ''
	};

	componentDidMount() {
		this.props.dispatch(appOperations.loadWalletsOperation());
	}

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			this.setState({ error: this.props.error });
		}
	}

	handleWalletSelection = event => {
		this.setState({ wallet: event.target.value });
	};

	handleUnlockAction = async () => {
		await this.props.dispatch(
			appOperations.unlockWalletWithPasswordOperation(this.state.wallet, this.state.password)
		);
	};

	handlePasswordChange = async event => {
		event.persist();
		if (this.state.error !== '') {
			await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		}
		this.setState({ password: event.target.value, error: '' });
	};

	render() {
		const { classes, wallets } = this.props;
		return (
			<Grid container direction="column" justify="center" alignItems="center" spacing={24}>
				<Grid
					container
					item
					direction="column"
					justify="flex-start"
					alignItems="flex-start"
					spacing={24}
				>
					<Grid item>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							spacing={16}
						>
							<Grid item>
								<Avatar className={classes.avatar}>1</Avatar>
							</Grid>
							<Grid item>
								<Grid
									container
									direction="column"
									justify="flex-start"
									alignItems="flex-start"
								>
									<Grid item>
										<Typography
											variant="subtitle2"
											color="secondary"
											gutterBottom
										>
											SELECT AN ETH ADDRESS STORED ON THE SELFKEY IDENTITY
											WALLET
										</Typography>
									</Grid>
									<Grid item className={classes.selectInput}>
										<FormControl variant="filled" fullWidth>
											<Select
												value={this.state.wallet}
												onChange={this.handleWalletSelection}
												displayEmpty
												name="wallet"
												disableUnderline
												IconComponent={KeyboardArrowDown}
												input={<Input disableUnderline fullWidth />}
												autoWidth
											>
												<MenuItem value={-1}>
													<em>Choose...</em>
												</MenuItem>
												{wallets.map((wallet, index) => (
													<MenuItem key={index} value={wallet.id}>
														{wallet.publicKey}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							spacing={16}
						>
							<Grid item>
								<Avatar className={classes.avatar}>2</Avatar>
							</Grid>
							<Grid item>
								<Grid
									container
									direction="column"
									justify="flex-start"
									alignItems="flex-start"
								>
									<Grid item>
										<Typography
											variant="subtitle2"
											color="secondary"
											gutterBottom
										>
											UNLOCK IT WITH YOUR PASSWORD
										</Typography>
									</Grid>
									<Grid item className={classes.passwordInput}>
										<Input
											error={this.state.error !== ''}
											fullWidth
											type="password"
											onChange={this.handlePasswordChange}
										/>
										{this.state.error !== '' && (
											<Typography
												variant="subtitle2"
												color="error"
												gutterBottom
											>
												{this.state.error}
											</Typography>
										)}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Button variant="contained" onClick={this.handleUnlockAction}>
						UNLOCK
					</Button>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	const app = appSelectors.selectApp(state);
	return {
		wallets: app.wallets,
		error: app.error
	};
};

export default connect(mapStateToProps)(withStyles(styles)(ExistingAddress));
