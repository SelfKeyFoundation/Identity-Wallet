import React, { Component } from 'react';
import {
	Modal,
	Typography,
	Button,
	Grid,
	Table,
	TableHead,
	Radio,
	TableBody,
	CircularProgress,
	withStyles
} from '@material-ui/core';
import {
	ModalWrap,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
	ModalCloseIcon,
	ViewIcon,
	SmallTableRow,
	SmallTableCell,
	SmallTableHeadRow,
	KeyIconButton
} from 'selfkey-ui';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';

const styles = theme => ({
	modalWrap: {
		width: '800px'
	},
	closeButton: {
		top: '20px',
		left: '20px'
	}
});

class SelectAddress extends Component {
	state = {
		page: 0,
		loading: false,
		selectedAddress: '',
		selected: -1,
		path: ''
	};

	componentDidMount() {
		this.setState({ isModalOpen: this.props.open });
	}

	async componentDidUpdate(prevProps) {
		if (this.props.hardwareWallets !== prevProps.hardwareWallets) {
			this.setState({ loading: false });
		}
	}

	handleNext = async () => {
		const page = this.state.page + 5;
		this.setState({ page, loading: true });
		await this.props.dispatch(appOperations.loadOtherHardwareWalletsOperation(page));
	};

	handlePrevious = async () => {
		const page = this.state.page - 5;
		this.setState({ page, loading: true });
		await this.props.dispatch(appOperations.loadOtherHardwareWalletsOperation(page));
	};

	handleClose = () => {
		this.props.dispatch(push('/unlockWallet'));
	};

	handleChange = (event, index) => {
		this.setState({
			selectedAddress: event.target.value,
			selected: index,
			path: this.props.hardwareWallets[index].path
		});
	};

	handleSelectedAddress = async () => {
		await this.props.dispatch(
			appOperations.unlockWalletWithPublicKeyOperation(
				this.state.selectedAddress,
				this.state.path
			)
		);
	};

	renderModalBody = () => {
		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="flex-start"
				spacing={40}
			>
				<Grid item>
					<Typography variant="h4">
						Select an Ethereum (ETH) address you would like to use:
					</Typography>
				</Grid>
				<Grid container item justify="center" alignItems="center">
					<Table>
						<TableHead>
							<SmallTableHeadRow>
								<SmallTableCell />
								<SmallTableCell>
									<Typography variant="overline" gutterBottom>
										YOUR ADDRESS
									</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline" gutterBottom>
										BALANCE
									</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline" gutterBottom>
										TOKEN BALANCES
									</Typography>
								</SmallTableCell>
							</SmallTableHeadRow>
						</TableHead>
						<TableBody>
							{this.props.hardwareWallets.map((wallet, index) => (
								<SmallTableRow key={index}>
									<SmallTableCell>
										<Radio
											onChange={e => this.handleChange(e, index)}
											value={wallet.address}
											name="radio-button-address"
											aria-label={wallet.address}
											checked={this.state.selected === index}
										/>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1" gutterBottom>
											{wallet.address}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1" gutterBottom>
											{wallet.balance}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Button
											onClick={e => {
												window.openExternal(
													e,
													`https://etherscan.io/address/${wallet.address}`
												);
											}}
										>
											<ViewIcon />
											<Typography
												variant="subtitle1"
												color="secondary"
												gutterBottom
											>
												View on Etherscan
											</Typography>
										</Button>
									</SmallTableCell>
								</SmallTableRow>
							))}
						</TableBody>
					</Table>
				</Grid>
				<Grid item container justify="flex-end">
					<Grid
						container
						direction="row"
						justify="flex-end"
						alignItems="flex-end"
						spacing={8}
					>
						<Grid item>
							<KeyIconButton
								aria-label="Previous Page"
								onClick={this.handlePrevious}
								disabled={this.state.page === 0}
							>
								<KeyboardArrowLeft />
							</KeyIconButton>
						</Grid>

						<Grid item>
							<KeyIconButton aria-label="Next Page" onClick={this.handleNext}>
								<KeyboardArrowRight />
							</KeyIconButton>
						</Grid>
					</Grid>
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
							<Button
								variant="contained"
								size="large"
								onClick={this.handleSelectedAddress}
							>
								USE SELECTED ADDRESS
							</Button>
						</Grid>
						<Grid item>
							<Button variant="outlined" size="large" onClick={this.handleClose}>
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
					<ModalWrap className={this.props.classes.modalWrap}>
						<ModalCloseButton
							onClick={this.handleClose}
							className={this.props.classes.closeButton}
						>
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
									<Typography variant="h6">Choose An Ethereum Address</Typography>
								</Grid>
								<Grid item>{this.state.loading && <CircularProgress />}</Grid>
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
		hardwareWallets: app.hardwareWallets
	};
};

export default connect(mapStateToProps)(withStyles(styles)(SelectAddress));
