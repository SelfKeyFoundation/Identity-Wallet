import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getServiceDetails, hasBalance } from 'common/exchanges/selectors';
import { marketplacesSelectors } from 'common/marketplaces';
import { kycSelectors, kycOperations } from 'common/kyc';
import { Logger } from 'common/logger';
import { push } from 'connected-react-router';
import { walletSelectors } from 'common/wallet';
import { MarketplaceServiceDetails } from './service-details';

// eslint-disable-next-line
const log = new Logger('marketplace-item-container');

const mapStateToProps = (state, props) => {
	const name = props.match.params.name;
	let item = getServiceDetails(state, name);
	let serviceId = `${item.serviceOwner}_${item.serviceId}`;
	let templates = [];
	if (item.relying_party_config && item.relying_party_config.templates) {
		templates = item.relying_party_config.templates;
	}
	return {
		wallet: walletSelectors.getWallet(state),
		item,
		hasBalance: hasBalance(state, name),
		stake: marketplacesSelectors.stakeSelector(state, serviceId),
		pendingTransaction: marketplacesSelectors.pendingTransactionSelector(
			state,
			item.serviceOwner,
			item.serviceId
		),
		relyingPartyName: name,
		templates,
		relyingParty: kycSelectors.relyingPartySelector(state, name),
		relyingPartyIsActive: kycSelectors.relyingPartyIsActiveSelector(state, name),
		relyingPartyShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(state, name)
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
