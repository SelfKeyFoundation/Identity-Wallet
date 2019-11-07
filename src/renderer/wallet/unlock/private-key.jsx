import React, { PureComponent } from 'react';
import { Avatar, Input, Button, Grid, Typography, InputAdornment } from '@material-ui/core';
import { VisibilityOffIcon, VisibilityOnIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	input: {
		width: '500px'
	},
	pointer: {
		cursor: 'pointer'
	},
	bottomSpace: {
		marginBottom: '1em'
	}
});

class PrivateKey extends PureComponent {
	state = {
		privateKey: '',
		error: '',
		inputType: 'password',
		visibilityComponent: <VisibilityOffIcon />
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			this.setState({ error: this.props.error });
		}
	}

	resetErrorState = async () => {
		if (this.state.error !== '') {
			await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		}
	};

	handleVisibility = event => {
		if (this.state.inputType === 'password') {
			this.setState({
				...this.state,
				inputType: 'text',
				visibilityComponent: <VisibilityOnIcon />
			});
		} else {
			this.setState({
				...this.state,
				inputType: 'password',
				visibilityComponent: <VisibilityOffIcon />
			});
		}
	};

	handleUnlockAction = async () => {
		await this.props.dispatch(
			appOperations.unlockWalletWithPrivateKeyOperation(this.state.privateKey)
		);
	};

	handlePrivateKeyChange = async event => {
		event.persist();
		await this.resetErrorState();
		this.setState({ privateKey: event.target.value, error: '' });
	};

	render() {
		const { classes } = this.props;
		const { privateKey } = this.state;
		return (
			<div className={classes.root}>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="center"
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
											ENTER YOUR PRIVATE KEY
										</Typography>
									</Grid>
									<Grid item className={classes.input}>
										<Input
											id="privateKeyInput"
											fullWidth
											error={this.state.error !== ''}
											placeholder="0x"
											endAdornment={
												<InputAdornment
													position="start"
													className={classes.pointer}
												>
													<div onClick={this.handleVisibility}>
														{this.state.visibilityComponent}
													</div>
												</InputAdornment>
											}
											type={this.state.inputType}
											onChange={this.handlePrivateKeyChange}
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
					<Grid item>
						<Button
							id="unlockPrivateKeyButton"
							variant="contained"
							size="large"
							onClick={this.handleUnlockAction}
							disabled={!privateKey}
						>
							UNLOCK
						</Button>
					</Grid>
					<Grid item>
						<Typography variant="body2" color="secondary">
							Warning: Please keep your private keys safe and secure.
						</Typography>
					</Grid>
				</Grid>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const app = appSelectors.selectApp(state);
	return {
		error: app.error
	};
};

export default connect(mapStateToProps)(withStyles(styles)(PrivateKey));
