import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { getServiceDetails, hasBalance } from 'common/exchanges/selectors';
import { marketplacesSelectors } from 'common/marketplaces';
import { marketplaceSelectors } from 'common/marketplace';
import { kycSelectors, kycOperations } from 'common/kyc';
import { Logger } from 'common/logger';
import { push } from 'connected-react-router';
import { walletSelectors } from 'common/wallet';
import { MarketplaceServiceDetails } from './service-details';

// eslint-disable-next-line
const log = new Logger('marketplace-item-container');

const mapStateToProps = (state, props) => {
	const id = props.match.params.inventoryId;
	const item = marketplaceSelectors.selectInventoryItemById(state, id);

	let rpDetails = marketplaceSelectors.selectRPDetails(state, item.vendorId);
	let serviceId = `${rpDetails.serviceOwner}_${rpDetails.serviceId}`;

	let templates = [];
	if (rpDetails.relyingPartyConfig && rpDetails.relyingPartyConfig.templates) {
		templates = rpDetails.relyingPartyConfig.templates;
	}
	return {
		wallet: walletSelectors.getWallet(state),
		item,
		hasBalance: marketplaceSelectors.hasBalance(state, item.vendorId),
		stake: marketplacesSelectors.stakeSelector(state, serviceId),
		pendingTransaction: marketplacesSelectors.pendingTransactionSelector(
			state,
			item.serviceOwner,
			item.serviceId
		),
		relyingPartyName: item.vendorId,
		templates,
		relyingParty: kycSelectors.relyingPartySelector(state, rpDetails.name),
		relyingPartyIsActive: kycSelectors.relyingPartyIsActiveSelector(state, rpDetails.name),
		relyingPartyShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			rpDetails.name
		)
	};
};

class MarketplaceServiceDetailsPageComponent extends Component {
	async componentDidMount() {
		if (this.props.relyingPartyShouldUpdate) {
			await this.props.dispatch(kycOperations.loadRelyingParty(this.props.item.name));
		}
	}

	backAction = () => {
		this.props.dispatch(push('/main/marketplace-exchanges'));
	};

	render() {
		let item = this.props.item;
		return (
			<div>
				<MarketplaceServiceDetails
					{...this.props}
					item={item}
					backAction={this.backAction}
				/>
			</div>
		);
	}
}

export const MarketplaceServiceDetailsPage = connect(mapStateToProps)(
	MarketplaceServiceDetailsPageComponent
);

export default MarketplaceServiceDetailsPage;
