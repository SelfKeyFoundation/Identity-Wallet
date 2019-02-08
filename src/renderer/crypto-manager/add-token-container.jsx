import React, { Component } from 'react';
import { Grid, Button, Typography, withStyles, TextField } from '@material-ui/core';
import { tokensOperations, tokensSelectors } from 'common/tokens';
import { walletTokensOperations } from 'common/wallet-tokens';
import { MyCryptoLargeIcon } from 'selfkey-ui';
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
	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/crypto-manager'));
	};
	handleFieldChange = evt => {
		let { name, value } = evt.target;
		let found = (this.props.tokens || []).find(
			t => (t[name] || '').toUpperCase() === (value || '').toUpperCase()
		);
		if (!found) {
			this.setState({ address: '', symbol: '', decimal: '', found, [name]: value });
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
				<Grid item>
					<Typography variant="body1">
						Add ERC20 tokens to be displayed in the dashboard. After entering the token
						address, the wallet will verify it exists on the blockchain and auto-fill
						the remaining information of ticker and decimals.
					</Typography>
				</Grid>
				<Grid item>
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="stretch"
						spacing={8}
					>
						<Grid item>
							<TextField
								name="address"
								label="Token Address"
								value={address}
								onChange={this.handleFieldChange}
							/>
						</Grid>
						<Grid item>
							<TextField
								name="symbol"
								label="Symbol"
								value={symbol}
								onChange={this.handleFieldChange}
							/>
						</Grid>
						<Grid item>
							<TextField name="decimal" label="Decimal" value={decimal} disabled />
						</Grid>
						<Grid item>
							<Grid container spacing={24}>
								<Grid item>
									<Button
										variant="contained"
										disabled={!found}
										onClick={this.handleSubmit}
									>
										Add Custom Token
									</Button>
								</Grid>

								<Grid item>
									<Button
										variant="outlined"
										color="secondary"
										onClick={this.handleBackClick}
									>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
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
