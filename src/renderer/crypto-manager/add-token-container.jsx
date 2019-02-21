import React, { Component } from 'react';
import { Grid, Button, Typography, withStyles, Input, IconButton } from '@material-ui/core';
import { tokensOperations, tokensSelectors } from 'common/tokens';
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
	input: {
		width: '100%'
	},
	bottomSpace: {
		marginBottom: '30px'
	},
	link: {
		color: '#00C0D9',
		textDecoration: 'none'
	}
});

class AddTokenContainerComponent extends Component {
	state = {
		address: '',
		symbol: '',
		decimal: '',
		found: null
	};
	componentDidMount() {
		this.props.dispatch(tokensOperations.loadTokensOperation());
	}

	componentDidUpdate(prevProps) {
		if (prevProps.tokens.length !== this.props.tokens.length) {
			if (this.state.address !== '') {
				this.findToken(this.state.address);
			}
		}
	}

	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/crypto-manager'));
	};
	handleFieldChange = async event => {
		this.findToken(event.target.value);
	};

	findToken = async contractAddress => {
		let found = (this.props.tokens || []).find(
			t => (t['address'] || '').toUpperCase() === (contractAddress || '').toUpperCase()
		);
		if (!found) {
			await this.props.dispatch(tokensOperations.addTokenOperation(contractAddress));
			this.setState({
				symbol: '',
				decimal: '',
				found,
				address: contractAddress
			});
			return;
		}
		this.setState({ ...found, found });
	};
	handleSubmit = () => {
		const { found } = this.state;
		if (!found || !found.id) return;
		this.props.dispatch(walletTokensOperations.createWalletTokenOperation(found.id));
		this.handleBackClick();
	};
	render() {
		const { classes } = this.props;
		const { address, symbol, decimal, found } = this.state;
		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={32}
			>
				<Button
					variant="outlined"
					color="secondary"
					size="small"
					onClick={this.handleBackClick}
					className={this.props.classes.back}
				>
					‹ Back
				</Button>
				<Grid item>
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
														href="https://help.selfkey.org"
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
									className={classes.input}
									disableUnderline
								/>
							</Grid>
							<Grid item>
								<Typography variant="overline" gutterBottom>
									Token Symbol
								</Typography>
								<Input
									name="symbol"
									value={symbol}
									onChange={this.handleFieldChange}
									className={classes.input}
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
											disabled={!found}
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
	return { tokens: tokensSelectors.allTokens(state) };
};

export const AddTokenContainer = connect(mapStateToProps)(
	withStyles(styles)(AddTokenContainerComponent)
);

export default AddTokenContainer;
