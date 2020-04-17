import React, { PureComponent } from 'react';
import { Avatar, Input, Button, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';

const styles = theme => ({
	passwordInput: {
		width: '500px'
	},
	button: {
		width: '500px'
	},
	menuItem: {
		display: 'flex'
	},
	filePath: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '500px',
		whiteSpace: 'nowrap',
		marginLeft: '40px'
	},
	bottomSpace: {
		marginBottom: '1em'
	}
});

class NewAddress extends PureComponent {
	state = {
		password: '',
		filePath: '',
		error: ''
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			this.setState({ error: this.props.error });
		}
	}

	handleSelectFile = async event => {
		event.persist();
		const filePath = await window.openFileSelectDialog(event);
		this.setState({ filePath });
	};

	handleUnlockAction = async () => {
		await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		await this.props.dispatch(
			appOperations.unlockWalletWithNewFileOperation(this.state.filePath, this.state.password)
		);
	};

	handlePasswordChange = async event => {
		event.persist();
		this.setState({ password: event.target.value, error: '' });
	};

	render() {
		const { classes } = this.props;
		const { filePath, password } = this.state;
		const fileSelected = filePath !== '';

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
											SELECT A KEYSTORE FILE (UTC/JSON)
										</Typography>
									</Grid>
									<Grid item className={classes.selectInput}>
										<Button
											size="large"
											variant="outlined"
											color="primary"
											onClick={this.handleSelectFile}
											className={classes.button}
										>
											SELECT KEYSTORE FILE
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					{fileSelected && (
						<Grid item>
							<Typography variant="caption" className={classes.filePath}>
								{filePath}
							</Typography>
						</Grid>
					)}
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
						disabled={!fileSelected || !password}
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
		error: app.error
	};
};

export default connect(mapStateToProps)(withStyles(styles)(NewAddress));
