import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CryptoPriceTableContainer from './crypto-price-table-container';
import { push } from 'connected-react-router';
import { getLocale } from 'common/locale/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { walletTokensOperations } from 'common/wallet-tokens';
import { CryptoManager } from './crypto-manager';
import { featureIsEnabled } from 'common/feature-flags';

class CryptoManagerContainerComponent extends PureComponent {
	state = {
		showAddedModal: false,
		tokenAdded: undefined,
		showRemovedModal: false
	};

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	componentDidUpdate(prevProps) {
		let isTokenAdded = prevProps.existingTokens.length < this.props.existingTokens.length;
		if (isTokenAdded) {
			let tokenAdded = this.props.existingTokens[this.props.existingTokens.length - 1];
			this.setState({ showAddedModal: isTokenAdded, tokenAdded: tokenAdded });
		}
	}

	handleAddTokenClick = evt => {
		evt.preventDefault();
		this.props.dispatch(push('/main/add-token'));
	};

	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};

	handleRemoveTokenClick = (event, token) => {
		event && event.preventDefault();
		this.props.dispatch(
			walletTokensOperations.updateWalletTokenStateOperation(1 - +token.recordState, token.id)
		);
		this.setState({ showRemovedModal: true });
	};

	handleCloseTokenAddedModal = evt => {
		evt && evt.preventDefault();
		this.setState({ showAddedModal: false, tokenAdded: undefined });
	};

	handleCloseTokenRemovedModal = evt => {
		evt && evt.preventDefault();
		this.setState({ showRemovedModal: false });
	};

	handleManageAllowanceClick = token => {
		this.props.dispatch(push(`/main/allowance-list/${token ? token.symbol : ''}`));
	};

	render() {
		const { locale } = this.props;
		const { showAddedModal, showRemovedModal, tokenAdded } = this.state;
		return (
			<CryptoManager
				locale={locale}
				tokenAdded={tokenAdded}
				onCloseTokenAddedModal={this.handleCloseTokenAddedModal}
				onCloseTokenRemovedModal={this.handleCloseTokenRemovedModal}
				onBackClick={this.handleBackClick}
				onAddTokenClick={this.handleAddTokenClick}
				onManageAllowanceClick={
					featureIsEnabled('contract') ? evt => this.handleManageAllowanceClick() : null
				}
				showAddedModal={showAddedModal}
				showRemovedModal={showRemovedModal}
				cryptoPriceTableComponent={
					<CryptoPriceTableContainer
						toggleAction={this.handleRemoveTokenClick}
						onManageAllowanceClick={
							featureIsEnabled('contract') ? this.handleManageAllowanceClick : null
						}
					/>
				}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...getLocale(state),
		existingTokens: getTokens(state)
	};
};

export const CryptoMangerContainer = connect(mapStateToProps)(CryptoManagerContainerComponent);

export default CryptoMangerContainer;
