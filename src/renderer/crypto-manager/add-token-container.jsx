import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { tokensOperations, tokensSelectors } from 'common/tokens';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import { getTokens } from 'common/wallet-tokens/selectors';
import { walletTokensOperations } from 'common/wallet-tokens';
import history from 'common/store/history';
import { AddToken } from './add-token';

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
		history.getHistory().goBack();
	};

	handleFieldChange = async event => {
		let value = event.target.value;
		this.setState({ searching: true, found: true }, async () => {
			await this.findToken(value);
		});
	};

	handleHelpClick = e => {
		window.openExternal(e, 'https://help.selfkey.org/');
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
		return (
			<AddToken
				{...this.props}
				{...this.state}
				onFieldChange={this.handleFieldChange}
				onSubmit={this.handleSubmit}
				onBackClick={this.handleBackClick}
				onHelpClick={this.handleHelpClick}
			/>
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

export const AddTokenContainer = connect(mapStateToProps)(AddTokenContainerComponent);

export default AddTokenContainer;
