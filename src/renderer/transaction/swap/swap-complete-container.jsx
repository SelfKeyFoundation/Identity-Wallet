import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/styles';
import { getWallet } from 'common/wallet/selectors';
import { addressBookOperations } from 'common/address-book';
import { transactionSelectors } from 'common/transaction';
import { getTokens } from 'common/wallet-tokens/selectors';
import { tokensOperations, tokensSelectors } from 'common/tokens';
import { walletTokensOperations } from 'common/wallet-tokens';
import { SwapComplete } from './swap-complete';

const styles = theme => ({});

class SwapCompletedContainer extends PureComponent {
	async componentDidMount() {
		const { contractAddress } = this.props;

		if (contractAddress) {
			// Validate address with library call
			await this.props.dispatch(addressBookOperations.validateAddress(contractAddress));
			// Try to find it on the current tokens list
			let found = (this.props.tokens || []).find(
				t => (t['address'] || '').toUpperCase() === (contractAddress || '').toUpperCase()
			);

			if (!found) {
				// Search token info on blockchain and add it to tokens list
				await this.props.dispatch(
					tokensOperations.addTokenOperation(contractAddress.toLowerCase())
				);
			}
		}
	}

	onBackClick = () => {
		const { contractAddress } = this.props;

		if (contractAddress) {
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

			if (found) {
				if (found.recordState === 0) {
					this.props.dispatch(
						walletTokensOperations.updateWalletTokenStateOperation(
							1 + +found.recordState,
							found.id
						)
					);
				} else {
					this.props.dispatch(
						walletTokensOperations.createWalletTokenOperation(found.id)
					);
				}
			}
		}

		this.props.dispatch(push(`/main/dashboard`));
	};

	render() {
		return <SwapComplete onBackClick={this.onBackClick} />;
	}
}

const mapStateToProps = (state, props) => {
	const { token } = props.match.params;
	return {
		contractAddress: token,
		tokens: tokensSelectors.allTokens(state),
		existingTokens: getTokens(state),
		transaction: transactionSelectors.getTransaction(state),
		address: getWallet(state).address
	};
};

const styledComponent = withStyles(styles)(SwapCompletedContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as SwapCompletedContainer };
