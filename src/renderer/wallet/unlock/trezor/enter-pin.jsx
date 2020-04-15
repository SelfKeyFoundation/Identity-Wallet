import React, { PureComponent } from 'react';
import { Typography, Grid, Paper, Button, Input, InputAdornment } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { ClearIcon } from 'selfkey-ui';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';
import { Popup } from '../../../common';

const boxComponentStyles = theme => ({
	square: {
		height: '80px !important',
		width: '80px !important',
		minWidth: '80px !important',
		cursor: 'pointer'
	},

	dot: {
		content: '',
		borderRadius: '100%',
		background: '#697C95',
		width: '20px',
		height: '20px'
	}
});

const styles = theme => ({
	clearButton: {
		cursor: 'pointer'
	},
	header: {
		marginBottom: '20px',
		marginTop: '30px'
	},
	h1: {
		marginBottom: '0.5em'
	},
	password: {
		width: '330px'
	}
});

const BoxComponent = withStyles(boxComponentStyles)(props => {
	return (
		<Paper className={props.classes.square} onClick={props.onClick}>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				style={{ minHeight: '100%' }}
			>
				<Grid item>
					<div className={props.classes.dot} />
				</Grid>
			</Grid>
		</Paper>
	);
});

class EnterPIN extends PureComponent {
	state = {
		pin: ''
	};

	handlePinClick = async digit => {
		if (this.props.error) {
			this.setState({ pin: digit });
			await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		} else {
			this.setState({ pin: `${this.state.pin}${digit}` });
		}
	};

	handleClear = () => {
		this.setState({ pin: '' });
	};

	handleEnter = async () => {
		await this.props.dispatch(appOperations.enterTrezorPinOperation(null, this.state.pin));
	};

	handleCancel = async () => {
		await this.props.dispatch(appOperations.enterTrezorPinOperation(new Error('cancel'), null));
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
						Please enter your PIN.
					</Typography>
					<Typography variant="h3">
						Look at the device for the number positions.
					</Typography>
				</Grid>
				<Grid item>
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="center"
						spacing={3}
					>
						<Grid item>
							<Grid
								container
								direction="row"
								justify="center"
								alignItems="center"
								spacing={3}
							>
								<Grid item>
									<Button
										component={BoxComponent}
										onClick={e => this.handlePinClick(7)}
									/>
								</Grid>
								<Grid item>
									<Button
										component={BoxComponent}
										onClick={e => this.handlePinClick(8)}
									/>
								</Grid>
								<Grid item>
									<Button
										component={BoxComponent}
										onClick={e => this.handlePinClick(9)}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Grid
								container
								direction="row"
								justify="center"
								alignItems="center"
								spacing={3}
							>
								<Grid item>
									<Button
										component={BoxComponent}
										onClick={e => this.handlePinClick(4)}
									/>
								</Grid>
								<Grid item>
									<Button
										component={BoxComponent}
										onClick={e => this.handlePinClick(5)}
									/>
								</Grid>
								<Grid item>
									<Button
										component={BoxComponent}
										onClick={e => this.handlePinClick(6)}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Grid
								container
								direction="row"
								justify="center"
								alignItems="center"
								spacing={3}
							>
								<Grid item>
									<Button
										component={BoxComponent}
										onClick={e => this.handlePinClick(1)}
									/>
								</Grid>
								<Grid item>
									<Button
										component={BoxComponent}
										onClick={e => this.handlePinClick(2)}
									/>
								</Grid>
								<Grid item>
									<Button
										component={BoxComponent}
										onClick={e => this.handlePinClick(3)}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item className={classes.password}>
					<Input
						type="password"
						disabled
						value={this.state.pin}
						fullWidth
						error={this.props.error !== ''}
						endAdornment={
							<InputAdornment position="start">
								<div onClick={this.handleClear} className={classes.clearButton}>
									<ClearIcon />
								</div>
							</InputAdornment>
						}
					/>
					{this.props.error !== '' && (
						<Typography variant="subtitle2" color="error" gutterBottom>
							{this.props.error}
						</Typography>
					)}
				</Grid>
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
			<Popup closeAction={this.handleCancel} open text="Trezor PIN">
				{this.renderModalBody()}
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	const app = appSelectors.selectApp(state);
	return {
		error: app.error
	};
};

export default connect(mapStateToProps)(withStyles(styles)(EnterPIN));
