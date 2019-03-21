import React, { Component } from 'react';
import { Modal, Typography, Grid, Paper, Button, Input, InputAdornment } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import {
	ModalWrap,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
	ModalCloseIcon,
	ClearIcon
} from 'selfkey-ui';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';

const boxComponentStyles = theme => ({
	square: {
		height: '50px !important',
		width: '50px !important',
		minWidth: '50px !important',
		cursor: 'pointer'
	},

	dot: {
		content: '',
		borderRadius: '100%',
		background: '#fff',
		width: '8px',
		height: '8px'
	}
});

const styles = theme => ({
	clearButton: {
		cursor: 'pointer'
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

class EnterPIN extends Component {
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
			<Grid container direction="column" justify="center" alignItems="center" spacing={40}>
				<Grid item>
					<Typography variant="h1">Please Enter Your PIN.</Typography>
				</Grid>
				<Grid item>
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
						spacing={24}
					>
						<Grid item>
							<Grid
								container
								direction="row"
								justify="center"
								alignItems="center"
								spacing={24}
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
								spacing={24}
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
								spacing={24}
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
				<Grid item>
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
						spacing={24}
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
			<div>
				<Modal open={true}>
					<ModalWrap>
						<ModalCloseButton onClick={this.handleCancel}>
							<ModalCloseIcon />
						</ModalCloseButton>
						<ModalHeader>
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="center"
							>
								<Grid item>
									<Typography variant="h6">Trezor PIN</Typography>
								</Grid>
							</Grid>
						</ModalHeader>
						<ModalBody>{this.renderModalBody()}</ModalBody>
					</ModalWrap>
				</Modal>
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

export default connect(mapStateToProps)(withStyles(styles)(EnterPIN));
