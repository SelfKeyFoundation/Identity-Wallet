import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { marketplacesOperations, marketplacesSelectors } from 'common/marketplaces';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { pricesSelectors } from 'common/prices';
import { Return } from 'selfkey-ui';

const mapStateToProps = state => {
	return {
		fiat: getFiatCurrency(state),
		ethPrice: pricesSelectors.getBySymbol(state, 'ETH'),
		gas: ethGasStationInfoSelectors.getEthGasStationInfoWEI(state),
		service: marketplacesSelectors.servicesSelector(state)[0],
		gasLimit: 200000
	};
};

class ReturnController extends Component {
	componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		this.props.dispatch(marketplacesOperations.loadTransactions());
		this.props.dispatch(marketplacesOperations.loadStakes());
	}

	handleConfirmAction(fee) {
		const { service, gasLimit } = this.props;
		this.props.navigateToTransactionProgress();
		this.props.dispatch(
			marketplacesOperations.withdrawStake(
				service.serviceOwner,
				service.serviceId,
				fee,
				gasLimit
			)
		);
	}

	render() {
		const { closeAction, gas, fiat, ethPrice, gasLimit } = this.props;
		if (!gas.safeLow) {
			return <div>Loading</div>;
		}
		return (
			<Return
				minGasPrice={gas.safeLow}
				maxGasPrice={gas.fast}
				defaultValue={gas.avarage}
				gasLimit={gasLimit}
				fiat={fiat.fiatCurrency}
				fiatRate={ethPrice.priceUSD}
				onCancel={closeAction}
				onConfirm={fee => this.handleConfirmAction(fee)}
			/>
		);
	}
}

export default connect(mapStateToProps)(ReturnController);
