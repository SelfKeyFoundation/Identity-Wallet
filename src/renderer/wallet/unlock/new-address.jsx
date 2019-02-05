import React, { Component } from 'react';
import { Avatar, Input, Button, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';

const styles = theme => ({
	passwordInput: {
		width: '110%'
	},
	menuItem: {
		display: 'flex'
	}
});

class NewAddress extends Component {
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

	resetErrorState = async () => {
		if (this.state.error !== '') {
			await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		}
	};

	handleSelectFile = async event => {
		event.persist();
		await this.resetErrorState();
		const filePath = await window.openFileSelectDialog(event);
		this.setState({ filePath });
	};

	handleUnlockAction = async () => {
		await this.props.dispatch(
			appOperations.unlockWalletWithNewFileOperation(this.state.filePath, this.state.password)
		);
	};

	handlePasswordChange = async event => {
		event.persist();
		await this.resetErrorState();
		this.setState({ password: event.target.value, error: '' });
	};

	render() {
		const { classes } = this.props;
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
										<Typography variant="overline" gutterBottom>
											SELECT A KEYSTORE FILE (UTC/JSON)
										</Typography>
									</Grid>
									<Grid item className={classes.selectInput}>
										<Button
											size="large"
											variant="outlined"
											color="primary"
											onClick={this.handleSelectFile}
										>
											SELECT KEYSTORE FILE
										</Button>
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
										<Typography variant="overline" gutterBottom>
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
		error: app.error
	};
};

export default connect(mapStateToProps)(withStyles(styles)(NewAddress));
