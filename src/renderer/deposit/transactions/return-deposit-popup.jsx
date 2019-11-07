import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ethGasStationInfoOperations } from 'common/eth-gas-station';
import { marketplacesOperations, marketplacesSelectors } from 'common/marketplaces';

import { ReturnDepositContent } from './return-deposit-content';
import { Popup } from '../../common/popup';
import ReactPiwik from 'react-piwik';

const mapStateToProps = state => {
	return {
		tx: marketplacesSelectors.currentTransactionSelector(state)
	};
};

class ReturnDepositPopupComponent extends PureComponent {
	componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		this.props.dispatch(marketplacesOperations.loadTransactions());
		this.props.dispatch(marketplacesOperations.loadStakes());
	}

	async handleConfirmAction(gasPrice) {
		await this.props.dispatch(
			marketplacesOperations.updateCurrentTransactionAction({ gasPrice })
		);
		await this.props.dispatch(marketplacesOperations.confirmWithdrawTransaction());
		ReactPiwik.push(['trackEvent', 'Staking', 'Confirm', 'Withdraw']);
	}

	render() {
		const { closeAction, tx } = this.props;
		if (!tx.gasPriceEstimates.safeLow) {
			return <div>Loading</div>;
		}
		return (
			<Popup text="Return KEY Deposit" closeAction={closeAction}>
				<ReturnDepositContent
					minGasPrice={tx.gasPriceEstimates.safeLow}
					maxGasPrice={tx.gasPriceEstimates.fast}
					defaultValue={tx.gasPriceEstimates.avarage}
					gasLimit={tx.gasLimit}
					fiat={tx.fiat && tx.fiat.fiatCurrency ? tx.fiat.fiatCurrency : 'USD'}
					fiatRate={tx.fiatRate}
					onCancel={closeAction}
					onConfirm={gasLimit => this.handleConfirmAction(gasLimit)}
				/>
			</Popup>
		);
	}
}

export const MarketplaceReturnDepositPopup = connect(mapStateToProps)(ReturnDepositPopupComponent);

export default MarketplaceReturnDepositPopup;
