import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { tokensOperations, tokensSelectors } from 'common/tokens';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import { getTokens } from 'common/wallet-tokens/selectors';
import { walletTokensOperations } from 'common/wallet-tokens';
import history from 'common/store/history';
import {
	Grid,
	Button,
	Typography,
	withStyles,
	Input,
	IconButton,
	CircularProgress
} from '@material-ui/core';
import {
	MyCryptoLargeIcon,
	ModalWrap,
	ModalHeader,
	ModalBody,
	KeyTooltip,
	InfoTooltip,
	BackButton
} from 'selfkey-ui';

const styles = theme => ({
	wrap: {
		margin: 0,
		width: '100%'
	},
	back: {
		position: 'absolute',
		top: '100px',
		left: '20px'
	},
	form: {
		width: '400px'
	},
	textAlignCenter: {
		textAlign: 'center'
	},
	modalPosition: {
		position: 'static'
	},
	label: {
		marginBottom: '10px'
	},
	tooltip: {
		position: 'relative',
		top: '-2px'
	},
	loading: {
		position: 'relative',
		marginLeft: '10px',
		top: '5px'
	},
	searching: {
		height: '19px',
		width: '242px',
		color: '#00C0D9',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px',
		textTransform: 'none',
		marginLeft: '10px'
	},
	errorText: {
		height: '19px',
		width: '242px',
		color: '#FE4B61',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px'
	},
	errorColor: {
		color: '#FE4B61 !important',
		border: '2px solid #FE4B61 !important',
		backgroundColor: 'rgba(255,46,99,0.09) !important'
	},
	input: {
		width: '100%',
		'&::-webkit-input-placeholder': {
			fontSize: '14px',
			color: '#93B0C1'
		}
	},
	inputError: {
		borderBottom: '2px solid #FE4B61 !important'
	},
	bottomSpace: {
		marginBottom: '30px'
	},
	link: {
		color: '#00C0D9',
		cursor: 'pointer',
		textDecoration: 'none'
	},
	topSpace: {
		marginTop: '30px'
	}
});

class AddTokenContainerComponent extends PureComponent {
	state = {
		address: '',
		symbol: '',
		decimal: '',
		found: null,
		duplicate: null,
		searching: false
	};

	componentDidMount() {
		this.props.dispatch(tokensOperations.loadTokensOperation());
		this.resetErrors();
		window.scrollTo(0, 0);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.tokens.length !== this.props.tokens.length) {
			if (this.state.address !== '') {
				this.findToken(this.state.address);
			}
		}
		if (prevProps.addressError !== this.props.addressError) {
			if (this.state.searching) {
				this.setState({ searching: false });
			}
		}
		if (prevProps.tokenError !== this.props.tokenError) {
			if (this.state.searching) {
				this.setState({ searching: false });
			}
		}
	}

	resetErrors = () => {
		this.props.dispatch(addressBookOperations.resetAdd());
		this.props.dispatch(tokensOperations.resetTokenError());
	};

	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(history.getHistory().goBack());
	};

	handleFieldChange = async event => {
		let value = event.target.value;
		this.setState({ searching: true, found: true }, async () => {
			await this.findToken(value);
		});
	};

	findToken = async contractAddress => {
		this.resetErrors();
		if (contractAddress !== '') {
			// Validate address with library call
			await this.props.dispatch(addressBookOperations.validateAddress(contractAddress));
			// Try to find it on the current tokens list
			let found = (this.props.tokens || []).find(
				t => (t['address'] || '').toUpperCase() === (contractAddress || '').toUpperCase()
			);
			// Search for active duplicate token (recordState = 1)
			let duplicate = (this.props.existingTokens || []).find(
				t =>
					(t['address'] || '').toUpperCase() === (contractAddress || '').toUpperCase() &&
					(t['recordState'] || 0) === 1
			);
			if (found && duplicate && duplicate['recordState'] === 0) {
				found['recordState'] = duplicate['recordState'];
				duplicate = null;
			}
			if (!found) {
				// Search token info on blockchain and add it to tokens list
				await this.props.dispatch(
					tokensOperations.addTokenOperation(contractAddress.toLowerCase())
				);
				this.setState({
					address: contractAddress,
					symbol: '',
					decimal: '',
					found: found,
					duplicate: duplicate
				});
			} else {
				this.setState({
					address: contractAddress,
					symbol: found ? found.symbol : '',
					decimal: found ? found.decimal : '',
					found: found,
					duplicate: duplicate,
					searching: false
				});
			}
		} else {
			this.setState({
				address: contractAddress,
				symbol: '',
				decimal: '',
				found: null,
				duplicate: null,
				searching: false
			});
		}
	};

	handleSubmit = () => {
		const { found } = this.state;
		if (!found || !found.id) return;
		if (found.recordState === 0) {
			this.props.dispatch(
				walletTokensOperations.updateWalletTokenStateOperation(
					1 + +found.recordState,
					found.id
				)
			);
		} else {
			this.props.dispatch(walletTokensOperations.createWalletTokenOperation(found.id));
		}
		this.handleBackClick();
	};

	render() {
		const { classes, addressError, tokenError } = this.props;
		const { address, symbol, decimal, found, duplicate, searching } = this.state;
		const hasAddressError =
			(addressError !== '' && addressError !== undefined && address !== '') ||
			(tokenError !== '' && tokenError !== undefined && address !== '');
		const notFound = !found && address !== '' && !hasAddressError && !duplicate;
		const addressInputClass = `${classes.input} ${
			(hasAddressError || notFound || duplicate) && !searching ? classes.errorColor : ''
		}`;

		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={32}
				className={classes.wrap}
			>
				<BackButton onclick={this.handleBackClick} />
				<Grid item className={classes.topSpace}>
					<MyCryptoLargeIcon />
				</Grid>
				<Grid item>
					<Typography variant="h1">Add Custom Token</Typography>
				</Grid>
				<Grid item xs={6} className={classes.textAlignCenter}>
					<Typography
						variant="body1"
						color="secondary"
						className={classes.bottomSpace}
						gutterBottom
					>
						Add ERC20 tokens to be displayed in the dashboard. After entering the token
						address, the wallet will verify it exists on the blockchain and auto-fill
						the remaining information of ticker and decimals.
					</Typography>
				</Grid>
				<ModalWrap className={classes.modalPosition}>
					<ModalHeader>
						<Grid container direction="row" justify="space-between" alignItems="center">
							<Grid item>
								<Typography variant="body1">Add Token</Typography>
							</Grid>
						</Grid>
					</ModalHeader>
					<ModalBody>
						<Grid
							container
							direction="column"
							justify="center"
							alignItems="stretch"
							spacing={32}
						>
							<Grid item>
								<Typography variant="overline" gutterBottom>
									Token Address
									<KeyTooltip
										interactive
										placement="top-start"
										className={classes.tooltip}
										title={
											<React.Fragment>
												<span>
													Every ERC-20 token has its own smart contract
													address. To learn more,{' '}
													<a
														className={classes.link}
														onClick={e => {
															window.openExternal(
																e,
																'https://help.selfkey.org/'
															);
														}}
													>
														click here.
													</a>
												</span>
											</React.Fragment>
										}
									>
										<IconButton aria-label="Info">
											<InfoTooltip />
										</IconButton>
									</KeyTooltip>
									{searching && (
										<React.Fragment>
											<span className={classes.loading}>
												<CircularProgress size={20} />
											</span>
											<span id="searching" className={classes.searching}>
												Please wait. Checking the blockchain for ERC-20{' '}
												token information.
											</span>
										</React.Fragment>
									)}
								</Typography>
								<Input
									name="address"
									value={address}
									onChange={this.handleFieldChange}
									className={addressInputClass}
									disableUnderline
								/>
								{!searching && hasAddressError && (
									<span id="addressError" className={classes.errorText}>
										{addressError || tokenError}
									</span>
								)}
								{!searching && notFound && (
									<span id="notFound" className={classes.errorText}>
										{`Token contract does not exist or not supported. Please double check and try again.`}
									</span>
								)}
								{!searching && duplicate && (
									<span id="duplicate" className={classes.errorText}>
										{`Address is already being used.`}
									</span>
								)}
							</Grid>
							<Grid item>
								<Typography variant="overline" className={classes.label}>
									Token Symbol
								</Typography>
								<Input
									name="symbol"
									value={symbol}
									className={classes.input}
									disabled
									disableUnderline
								/>
							</Grid>
							<Grid item>
								<Typography variant="overline" className={classes.label}>
									Decimal Places
								</Typography>
								<Input
									name="decimal"
									value={decimal}
									className={classes.input}
									disabled
									disableUnderline
								/>
							</Grid>
							<Grid item>
								<Grid container spacing={24}>
									<Grid item>
										<Button
											variant="contained"
											disabled={!found || duplicate || hasAddressError}
											size="large"
											onClick={this.handleSubmit}
										>
											Add Custom Token
										</Button>
									</Grid>

									<Grid item>
										<Button
											variant="outlined"
											color="secondary"
											size="large"
											onClick={this.handleBackClick}
										>
											Cancel
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</ModalBody>
				</ModalWrap>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		tokens: tokensSelectors.allTokens(state),
		existingTokens: getTokens(state),
		addressError: addressBookSelectors.getAddressError(state),
		tokenError: tokensSelectors.getTokenError(state)
	};
};

export const AddTokenContainer = connect(mapStateToProps)(
	withStyles(styles)(AddTokenContainerComponent)
);

export default AddTokenContainer;
