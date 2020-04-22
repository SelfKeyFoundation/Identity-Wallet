import React, { PureComponent } from 'react';
import { Typography, Grid, Button, Input, InputAdornment } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { VisibilityOffIcon, VisibilityOnIcon } from 'selfkey-ui';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';
import { Popup } from '../../../common';

const styles = theme => ({
	pointer: {
		cursor: 'pointer'
	},
	inputWidth: {
		width: '380px'
	},
	header: {
		marginBottom: '20px',
		marginTop: '30px'
	},
	h1: {
		marginBottom: '0.5em'
	}
});

class EnterPassphrase extends PureComponent {
	state = {
		passphrase: '',
		rePassphrase: '',
		error: '',
		inputType: 'password',
		visibilityComponent: <VisibilityOffIcon />
	};

	componentDidUpdate(prevProps) {
		if (prevProps.error !== this.props.error) {
			this.setState({ error: this.props.error });
		}
	}

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

	handlePassphraseChange = async event => {
		const passphrase = event.target.value;
		if (this.state.error) {
			await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		}
		this.setState({ passphrase });
	};

	handleRePassphraseChange = async event => {
		const rePassphrase = event.target.value;
		if (this.state.error) {
			await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		}
		this.setState({ rePassphrase });
	};

	handleEnter = async () => {
		if (this.state.passphrase !== this.state.rePassphrase) {
			this.setState({ error: 'Passphrase and Reconfirm passphrase must be equal.' });
		} else {
			await this.props.dispatch(
				appOperations.enterTrezorPassphraseOperation(null, this.state.passphrase)
			);
			if (this.props.goNextPath !== '') {
				await this.props.dispatch(push(this.props.goNextPath));
			}
		}
	};

	handleCancel = async () => {
		await this.props.dispatch(
			appOperations.enterTrezorPassphraseOperation(new Error('cancel'), null)
		);
		await this.props.dispatch(push('/unlockWallet/trezor'));
	};

	renderModalBody = () => {
		const { classes } = this.props;
		return (
			<Grid container direction="column" justify="center" alignItems="center" spacing={5}>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="center"
					className={classes.header}
				>
					<Typography variant="h1" className={classes.h1}>
						Please enter your passphrase.
					</Typography>
					<Typography variant="body1" color="secondary">
						Note that your passphrase is case-sensitive.
					</Typography>
				</Grid>
				<Grid item className={classes.inputWidth}>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="flex-start"
						spacing={1}
					>
						<Grid item>
							<Typography variant="overline" gutterBottom>
								PASSPHRASE
							</Typography>
						</Grid>
						<Grid item style={{ width: '100%' }}>
							<Input
								fullWidth
								error={this.state.error !== ''}
								endAdornment={
									<InputAdornment position="start" className={classes.pointer}>
										<div onClick={this.handleVisibility}>
											{this.state.visibilityComponent}
										</div>
									</InputAdornment>
								}
								type={this.state.inputType}
								onChange={this.handlePassphraseChange}
								placeholder="Enter Passphrase"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item className={classes.inputWidth}>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="flex-start"
						spacing={1}
					>
						<Grid item>
							<Typography variant="overline" gutterBottom>
								RECONFIRM PASSPHRASE
							</Typography>
						</Grid>
						<Grid item style={{ width: '100%' }}>
							<Input
								fullWidth
								error={this.state.error !== ''}
								endAdornment={
									<InputAdornment position="start" className={classes.pointer}>
										<div onClick={this.handleVisibility}>
											{this.state.visibilityComponent}
										</div>
									</InputAdornment>
								}
								type={this.state.inputType}
								onChange={this.handleRePassphraseChange}
								placeholder="Reconfirm Passphrase"
							/>
						</Grid>
					</Grid>
				</Grid>
				{this.state.error !== '' && (
					<Grid item>
						<Typography variant="subtitle2" color="error" gutterBottom>
							{this.state.error}
						</Typography>
					</Grid>
				)}
				<Grid item>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="center"
						spacing={3}
					>
						<Grid item>
							<Button variant="contained" size="large" onClick={this.handleEnter}>
								ENTER
							</Button>
						</Grid>
						<Grid item>
							<Button variant="outlined" size="large" onClick={this.handleCancel}>
								CANCEL
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	};

	render() {
		return (
			<Popup closeAction={this.handleCancel} open text="Trezor PASSPHRASE">
				{this.renderModalBody()}
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	const app = appSelectors.selectApp(state);
	return {
		error: app.error,
		goNextPath: appSelectors.selectGoNextPath(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(EnterPassphrase));
