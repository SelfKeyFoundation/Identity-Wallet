import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { tokensOperations, tokensSelectors } from 'common/tokens';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import { getTokens } from 'common/wallet-tokens/selectors';
import { walletTokensOperations } from 'common/wallet-tokens';
import {
	Grid,
	Button,
	Typography,
	withStyles,
	Input,
	CircularProgress,
	Paper
} from '@material-ui/core';
import { MergeIcon, ModalWrap, ModalHeader, ModalBody, CloseButtonIcon } from 'selfkey-ui';

const styles = theme => ({
	icon: {
		width: '66px',
		height: '71px'
	},
	modalPosition: {
		position: 'static',
		marginTop: '30px'
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
	bold: {
		fontWeight: 600
	},
	backButtonContainer: {
		left: '15px',
		position: 'absolute',
		top: '120px'
	},
	closeIcon: {
		position: 'absolute',
		right: '329px',
		top: '123px',
		cursor: 'pointer'
	},
	label: {
		marginBottom: '10px'
	},
	buttoms: {
		marginTop: '30px'
	}
});

class AssociateDIDComponent extends Component {
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
		this.props.dispatch(push('/main/selfkeyId'));
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
		const { address, found, duplicate, searching } = this.state;
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
			>
				<div className={classes.backButtonContainer}>
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						onClick={this.handleBackClick}
					>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
				<ModalWrap className={classes.modalPosition}>
					<Paper>
						<ModalHeader>
							<CloseButtonIcon
								onClick={this.handleBackClick}
								className={classes.closeIcon}
							/>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
							>
								<Grid item>
									<Typography variant="body1">
										Associate DID with this wallet
									</Typography>
								</Grid>
							</Grid>
						</ModalHeader>
						<ModalBody>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
							>
								<Grid item xs={2}>
									<MergeIcon className={classes.icon} />
								</Grid>
								<Grid item xs={10}>
									<Typography variant="body1" gutterBottom>
										If you already registered on the SelfKey Network, you can
										associate your existing DID number with this wallet. Just
										copy/paste it bellow.
									</Typography>
									<br />
									<Typography
										variant="overline"
										gutterBottom
										className={classes.label}
									>
										DID Number
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
										placeholder="did:key:"
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
									<Grid container spacing={24} className={classes.buttoms}>
										<Grid item>
											<Button
												variant="contained"
												disabled={!found || duplicate || hasAddressError}
												size="large"
												onClick={this.handleSubmit}
											>
												Associate DID
											</Button>
										</Grid>

										<Grid item>
											<Button
												variant="outlined"
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
					</Paper>
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

export const AssociateDID = connect(mapStateToProps)(withStyles(styles)(AssociateDIDComponent));

export default AssociateDID;
