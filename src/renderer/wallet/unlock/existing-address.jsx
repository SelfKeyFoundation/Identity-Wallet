import React, { PureComponent } from 'react';
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
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';
import { KeyboardArrowDown } from '@material-ui/icons';

const styles = theme => ({
	selectInput: {
		width: '500px'
	},
	passwordInput: {
		width: '500px'
	},
	menuItem: {
		display: 'flex'
	},
	dropdown: {
		width: '450px'
	},
	bottomSpace: {
		marginBottom: '1em'
	}
});

class ExistingAddress extends PureComponent {
	state = {
		wallet: -1,
		password: '',
		error: ''
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			this.setState({ error: this.props.error });
		}
	}

	handleWalletSelection = event => {
		this.setState({ wallet: event.target.value });
	};

	handleUnlockAction = async () => {
		await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		await this.props.dispatch(
			appOperations.unlockWalletWithPasswordOperation(this.state.wallet, this.state.password)
		);
	};

	handlePasswordChange = async event => {
		event.persist();
		this.setState({ password: event.target.value, error: '' });
	};

	render() {
		const { classes, wallets } = this.props;
		const { wallet, password } = this.state;
		return (
			<Grid container direction="column" justify="center" alignItems="center" spacing={3}>
				<Grid
					container
					item
					direction="column"
					justify="flex-start"
					alignItems="flex-start"
					spacing={3}
				>
					<Grid item>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							spacing={2}
						>
							<Grid item>
								<Avatar>
									<Typography variant="overline">1</Typography>
								</Avatar>
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
											variant="overline"
											className={classes.bottomSpace}
										>
											SELECT AN ETH ADDRESS STORED ON THE SELFKEY IDENTITY
											WALLET
										</Typography>
									</Grid>
									<Grid item className={classes.selectInput}>
										<FormControl variant="filled" fullWidth>
											<Select
												value={wallet}
												onChange={this.handleWalletSelection}
												displayEmpty
												name="wallet"
												disableUnderline
												IconComponent={KeyboardArrowDown}
												input={<Input disableUnderline fullWidth />}
												autoWidth
											>
												<MenuItem value={-1} className={classes.dropdown}>
													<em>Choose...</em>
												</MenuItem>
												{wallets.map((wallet, index) => (
													<MenuItem key={index} value={wallet.id}>
														{wallet.name
															? `${wallet.name} - ${wallet.address}`
															: wallet.address}
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
							spacing={2}
						>
							<Grid item>
								<Avatar>
									<Typography variant="overline">2</Typography>
								</Avatar>
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
											variant="overline"
											className={classes.bottomSpace}
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
											placeholder="Password"
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
					<Button
						variant="contained"
						size="large"
						onClick={this.handleUnlockAction}
						disabled={wallet < 0 || !password}
					>
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
