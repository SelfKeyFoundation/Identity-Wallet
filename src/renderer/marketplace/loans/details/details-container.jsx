import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { marketplacesSelectors } from 'common/marketplaces';
import { marketplaceSelectors } from 'common/marketplace';
import { kycSelectors, kycOperations } from 'common/kyc';
// import { push } from 'connected-react-router';
import { walletSelectors } from 'common/wallet';
import { LoansDetails } from './details';
import { MarketplaceComponent } from '../../common/marketplace-component';

const styles = theme => ({});

class LoansDetailsContainerComponent extends MarketplaceComponent {
	async componentDidMount() {
		if (this.props.relyingPartyShouldUpdate) {
			await this.props.dispatch(kycOperations.loadRelyingParty(this.props.item.name));
		}
	}

	onBackClick = () => window.history.back();

	render() {
		let item = this.props.item;
		return (
			<div>
				<LoansDetails
					{...this.props}
					item={item}
					application={this.getLastApplication()}
					backAction={this.onBackClick}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const id = props.match.params.inventoryId;
	const item = marketplaceSelectors.selectInventoryItemById(state, id);

	let rpDetails = marketplaceSelectors.selectRPDetails(state, item.vendorId);

	let templates = [];
	if (rpDetails.relyingPartyConfig && rpDetails.relyingPartyConfig.templates) {
		templates = rpDetails.relyingPartyConfig.templates;
	}
	return {
		wallet: walletSelectors.getWallet(state),
		item,
		hasBalance: marketplaceSelectors.hasBalance(state, item.vendorId),
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

const styledComponent = withStyles(styles)(LoansDetailsContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as LoansDetailsContainer };
