import React, { Component } from 'react';
import { Grid, Button, Typography, withStyles, Input, IconButton } from '@material-ui/core';
import { tokensOperations, tokensSelectors } from 'common/tokens';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import { getTokens } from 'common/wallet-tokens/selectors';
import { walletTokensOperations } from 'common/wallet-tokens';
import {
	MyCryptoLargeIcon,
	ModalWrap,
	ModalHeader,
	ModalBody,
	KeyTooltip,
	InfoTooltip
} from 'selfkey-ui';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

const styles = theme => ({
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
		boxSizing: 'border-box',
		width: '100%',
		border: '1px solid #384656',
		borderRadius: '4px',
		backgroundColor: '#1E262E',
		color: '#a9c5d6',
		fontSize: '14px',
		boxShadow:
			'inset -1px 0 0 0 rgba(0,0,0,0.24), 1px 0 0 0 rgba(118,128,147,0.2), 2px 0 2px 0 rgba(0,0,0,0.2)',
		paddingLeft: '10px',
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
	bold: {
		fontWeight: 600
	},
	backButtonContainer: {
		left: '15px',
		position: 'absolute',
		top: '120px'
	},
	topSpace: {
		marginTop: '30px'
	}
});

class AddTokenContainerComponent extends Component {
	state = {
		address: '',
		symbol: '',
		decimal: '',
		found: null,
		duplicate: null
	};
	componentDidMount() {
		this.props.dispatch(tokensOperations.loadTokensOperation());
		this.props.dispatch(addressBookOperations.resetAdd());
	}

	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/crypto-manager'));
	};

	handleFieldChange = async event => {
		this.findToken(event.target.value);
	};

	findToken = async contractAddress => {
		await this.props.dispatch(addressBookOperations.resetAdd());
		if (contractAddress !== '') {
			await this.props.dispatch(addressBookOperations.validateAddress(contractAddress));
			let found = (this.props.tokens || []).find(
				t => (t['address'] || '').toUpperCase() === (contractAddress || '').toUpperCase()
			);
			let duplicate = (this.props.existingTokens || []).find(
				t => (t['address'] || '').toUpperCase() === (contractAddress || '').toUpperCase()
			);
			if (found && duplicate && duplicate['recordState'] === 0) {
				duplicate = null;
			}
			this.setState({
				address: contractAddress,
				symbol: found ? found.symbol : '',
				decimal: found ? found.decimal : '',
				found: found,
				duplicate: duplicate
			});
		} else {
			this.setState({
				address: contractAddress,
				symbol: '',
				decimal: '',
				found: null,
				duplicate: null
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
		const { classes, addressError } = this.props;
		const { address, symbol, decimal, found, duplicate } = this.state;
		const hasAddressError = addressError !== '' && addressError !== undefined && address !== '';
		const notFound = !found && address !== '' && !hasAddressError && !duplicate;
		const addressInputClass = `${classes.input} ${
			hasAddressError || notFound || duplicate ? classes.errorColor : ''
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
								</Typography>
								<Input
									name="address"
									value={address}
									onChange={this.handleFieldChange}
									className={addressInputClass}
									disableUnderline
								/>
								{hasAddressError && (
									<span id="addressError" className={classes.errorText}>
										{addressError}
									</span>
								)}
								{notFound && (
									<span id="notFound" className={classes.errorText}>
										{`Token contract does not exist. Please double check and try again.`}
									</span>
								)}
								{duplicate && (
									<span id="duplicate" className={classes.errorText}>
										{`Address is already being used.`}
									</span>
								)}
							</Grid>
							<Grid item>
								<Typography variant="overline" gutterBottom>
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
								<Typography variant="overline" gutterBottom>
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
		addressError: addressBookSelectors.getAddressError(state)
	};
};

export const AddTokenContainer = connect(mapStateToProps)(
	withStyles(styles)(AddTokenContainerComponent)
);

export default AddTokenContainer;
