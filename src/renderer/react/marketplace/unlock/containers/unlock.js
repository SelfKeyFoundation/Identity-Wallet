import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
// import { marketplacesOperations } from 'common/marketplaces';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { pricesSelectors } from 'common/prices';
import { Unlock } from 'selfkey-ui';

const mapStateToProps = state => {
	return {
		fiat: getFiatCurrency(state),
		ethPrice: pricesSelectors.getBySymbol(state, 'ETH'),
		gas: ethGasStationInfoSelectors.getEthGasStationInfoWEI(state)
	};
};

class UnlockController extends Component {
	componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
	}

	handleConfirmAction() {
		this.props.navigateToTransactionProgress();
		// this.props.dispatch(marketplacesOperations.placeStake());
	}

	render() {
		const { closeAction, gas, fiat, ethPrice } = this.props;
		console.log(this.props);
		if (!gas.safeLow) {
			return <div>Loading</div>;
		}
		return (
			<Unlock
				minGasPrice={gas.safeLow}
				maxGasPrice={gas.fast}
				defaultValue={gas.avarage}
				gasLimit={45000}
				fiat={fiat.fiatCurrency}
				fiatRate={ethPrice.priceUSD}
				onCancel={closeAction}
				onConfirm={() => this.handleConfirmAction()}
			/>
		);
	}
}

export default connect(mapStateToProps)(UnlockController);
