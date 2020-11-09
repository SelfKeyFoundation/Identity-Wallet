import React, { PureComponent } from 'react';
import { Typography, Button, Grid, Table, TableHead, Radio, TableBody } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
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
import { Popup } from '../../common';

const styles = theme => ({
	modalWrap: {
		width: '800px'
	},
	closeButton: {
		top: '20px',
		left: '20px'
	},
	hrWrapper: {
		padding: `${theme.spacing(1, 2)} !important`,
		width: '100%'
	},
	hr: {
		backgroundColor: '#303C49',
		border: 0,
		height: '1px',
		width: '100%'
	},
	h4: {
		fontWeight: 400
	},
	viewIcon: {
		marginRight: theme.spacing(1)
	},
	viewButton: {
		paddingLeft: theme.spacing(0),
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: 'transparent',
			'& h6': {
				color: '#FFFFFF'
			},
			'& svg': {
				fill: '#FFFFFF'
			}
		}
	},
	radioButton: {
		paddingRight: theme.spacing(0),
		'& span': {
			marginRight: theme.spacing(0)
		}
	},
	tableCellPadding: {
		padding: theme.spacing(0, 2, 0, 1)
	},
	paginationWrap: {
		padding: `${theme.spacing(0, 2, 1)} !important`
	},
	pagination: {
		padding: `${theme.spacing(1, 0)} !important`
	},
	keyIconButton: {
		margin: '0 3px'
	},
	topSpace: {
		paddingBottom: `${theme.spacing(0)} !important`
	},
	popupClass: {
		left: 'calc(50% - 480px)',
		width: '960px'
	},
	closeBtn: {
		marginLeft: theme.spacing(22)
	}
});

class SelectAddress extends PureComponent {
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
				spacing={5}
			>
				<Grid item className={this.props.classes.topSpace}>
					<Typography variant="h4" className={this.props.classes.h4}>
						Select an Ethereum (ETH) address you would like to use:
					</Typography>
				</Grid>
				<Grid item className={this.props.classes.hrWrapper}>
					<hr className={this.props.classes.hr} />
				</Grid>
				<Grid container item justify="center" alignItems="center" style={{ paddingTop: 0 }}>
					<Table>
						<TableHead>
							<SmallTableHeadRow>
								<SmallTableCell />
								<SmallTableCell className={this.props.classes.tableCellPadding}>
									<Typography variant="overline">YOUR ADDRESS</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">BALANCE</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">TOKEN BALANCES</Typography>
								</SmallTableCell>
							</SmallTableHeadRow>
						</TableHead>
						<TableBody>
							{this.props.hardwareWallets.map((wallet, index) => (
								<SmallTableRow key={index}>
									<SmallTableCell className={this.props.classes.radioButton}>
										<Radio
											onChange={e => this.handleChange(e, index)}
											value={wallet.address}
											name="radio-button-address"
											aria-label={wallet.address}
											checked={this.state.selected === index}
										/>
									</SmallTableCell>
									<SmallTableCell className={this.props.classes.tableCellPadding}>
										<Typography variant="subtitle1">
											{wallet.address}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1">
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
											className={this.props.classes.viewButton}
										>
											<ViewIcon className={this.props.classes.viewIcon} />
											<Typography variant="subtitle1" color="secondary">
												View on Etherscan
											</Typography>
										</Button>
									</SmallTableCell>
								</SmallTableRow>
							))}
						</TableBody>
					</Table>
				</Grid>
				<Grid
					item
					container
					justify="flex-end"
					className={this.props.classes.paginationWrap}
				>
					<Grid
						container
						direction="row"
						justify="flex-end"
						alignItems="flex-end"
						spacing={1}
					>
						<Grid item className={this.props.classes.pagination}>
							<KeyIconButton
								aria-label="Previous Page"
								onClick={this.handlePrevious}
								disabled={this.state.page === 0}
								className={this.props.classes.keyIconButton}
							>
								<KeyboardArrowLeft />
							</KeyIconButton>
						</Grid>

						<Grid item className={this.props.classes.pagination}>
							<KeyIconButton
								aria-label="Next Page"
								onClick={this.handleNext}
								className={this.props.classes.keyIconButton}
							>
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
						spacing={3}
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
		const { classes } = this.props;
		return (
			<Popup
				closeAction={this.handleClose}
				open
				text="Choose An Ethereum Address"
				loading={this.state.loading}
				popupClass={classes.popupClass}
				closeButtonClass={classes.closeBtn}
			>
				{this.renderModalBody()}
			</Popup>
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
