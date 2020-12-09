import React, { PureComponent } from 'react';
import { Input, Button, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';

const styles = theme => ({
	avatar: {
		marginRight: '16px'
	},
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
	},
	itemBottomSpace: {
		marginBottom: '2em'
	},
	buttonBottomSpace: {
		marginBottom: '4em'
	}
});

class SeedPhrase extends PureComponent {
	state = {
		seed: '',
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

	handleUnlockAction = async () => {
		await this.props.dispatch(appOperations.startSeedUnlockOperation(this.state.seed));
	};

	handleSeedChange = async event => {
		event.persist();
		await this.resetErrorState();
		this.setState({ seed: event.target.value, error: '' });
	};

	render() {
		const { classes } = this.props;
		const { seed } = this.state;
		return (
			<div className={classes.root}>
				<Grid container direction="column" justify="center" alignItems="center">
					<Grid item className={classes.itemBottomSpace}>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="flex-start"
							wrap="nowrap"
						>
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
											SEED PHRASE
										</Typography>
									</Grid>
									<Grid item className={classes.input}>
										<Input
											fullWidth
											error={this.state.error !== ''}
											type="text"
											placeholder="Your wallet’s 12 word seed phrase…"
											onChange={this.handleSeedChange}
											onKeyUp={event => {
												if (event.keyCode === 13) {
													this.handleUnlockAction();
												}
											}}
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
					<Grid item className={classes.buttonBottomSpace}>
						<Button
							variant="contained"
							size="large"
							onClick={this.handleUnlockAction}
							disabled={!seed}
						>
							UNLOCK
						</Button>
					</Grid>
					<Grid item>
						<Typography variant="body2" color="secondary">
							Warning: Please keep your seed phrase safe and secure.
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

export default connect(mapStateToProps)(withStyles(styles)(SeedPhrase));
