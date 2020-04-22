import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { marketplacesSelectors } from 'common/marketplaces';
import { marketplaceSelectors } from 'common/marketplace';
import { kycSelectors, kycOperations } from 'common/kyc';
import { push } from 'connected-react-router';
import { walletSelectors } from 'common/wallet';
import { ExchangesDetails } from './exchanges-details';
import { MarketplaceExchangesComponent } from './common/marketplace-exchanges-component';

const styles = theme => ({});

class ExchangesDetailsContainer extends MarketplaceExchangesComponent {
	async componentDidMount() {
		if (this.props.relyingPartyShouldUpdate) {
			await this.props.dispatch(kycOperations.loadRelyingParty(this.props.item.name));
		}
	}

	onBackClick = () => this.props.dispatch(push(this.rootPath()));

	render() {
		let item = this.props.item;
		return (
			<div>
				<ExchangesDetails {...this.props} item={item} backAction={this.onBackClick} />
			</div>
		);
	}
}

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

const styledComponent = withStyles(styles)(ExchangesDetailsContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as ExchangesDetailsContainer };
