import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getServiceDetails, hasBalance } from 'common/exchanges/selectors';
import { marketplacesSelectors, marketplacesOperations } from 'common/marketplaces';
import { kycSelectors, kycOperations } from 'common/kyc';
import { Logger } from 'common/logger';
import { push } from 'connected-react-router';

import { MarketplaceServiceDetails } from './service-details';
import { MarketplaceDepositPopup } from '../transactions/deposit-popup';
import { MarketplaceReturnDepositPopup } from '../transactions/return-deposit-popup';
import { MarketplaceTransactionProcessingPopup } from '../transactions/transaction-processing-popup';
import { MarketplaceWithoutBalancePopup } from '../transactions/without-balance-popup';

const log = new Logger('marketplace-item-container');

const mapStateToProps = (state, props) => {
	const name = props.match.params.name;
	let item = getServiceDetails(state, name);
	let serviceId = `${item.serviceOwner}_${item.serviceId}`;
	return {
		item,
		hasBalance: hasBalance(state, name),
		stake: marketplacesSelectors.stakeSelector(state, serviceId),
		pendingTransaction: marketplacesSelectors.pendingTransactionSelector(
			state,
			item.serviceOwner,
			item.serviceId
		),
		relyingPartyName: name,
		relyingParty: kycSelectors.relyingPartySelector(state, name),
		relyingPartyIsActive: kycSelectors.relyingPartyIsActiveSelector(state, name),
		relyingPartyShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(state, name),
		transactionPopup: marketplacesSelectors.displayedPopupSelector(state)
	};
};

class MarketplaceServiceDetailsPageComponent extends Component {
	async componentDidMount() {
		await Promise.all([
			this.props.dispatch(marketplacesOperations.loadTransactions()),
			this.props.dispatch(marketplacesOperations.loadStakes())
		]);
		if (this.props.relyingPartyShouldUpdate) {
			await this.props.dispatch(kycOperations.loadRelyingParty(this.props.item.name));
		}
		this.updatePendingTransaction();
	}
	componentDidUpdate() {
		this.updatePendingTransaction();
	}
	componentWillUnmount() {
		if (!this.timeout) return;
		this.timeout = clearTimeout(this.timeout);
		delete this.timeout;
	}
	updatePendingTransaction() {
		if (!this.props.pendingTransaction) {
			if (!this.timeout) return;
			this.timeout = clearTimeout(this.timeout);
			delete this.timeout;
			return;
		}
		if (this.timeout) return;
		log.info('Will check transaction status in 5 sec');
		this.timeout = setTimeout(() => {
			this.props.dispatch(
				marketplacesOperations.updateTransactionStatus(this.props.pendingTransaction)
			);
			delete this.timeout;
			this.updatePendingTransaction();
		}, 5000);
	}

	unlockAction = () => {
		const { item, hasBalance, dispatch } = this.props;
		if (!hasBalance) {
			return dispatch(marketplacesOperations.showMarketplacePopupAction('noBalance'));
		}
		return dispatch(
			marketplacesOperations.startStakeTransaction(
				item.serviceOwner,
				item.serviceId,
				item.amount
			)
		);
	};

	closePopupAction = () => {
		const { dispatch, transactionPopup } = this.props;
		if (transactionPopup === 'pendingTransaction') {
			return dispatch(marketplacesOperations.showMarketplacePopupAction(null));
		}
		return dispatch(marketplacesOperations.cancelCurrentTransaction());
	};

	returnAction = () => {
		const { item, dispatch } = this.props;

		return dispatch(
			marketplacesOperations.startWithdrawTransaction(
				item.serviceOwner,
				item.serviceId,
				item.amount
			)
		);
	};

	backAction = () => {
		this.props.dispatch(push('/main/marketplace-exchanges'));
	};

	renderPopup() {
		const { transactionPopup } = this.props;
		if (transactionPopup === 'confirmStakeTransaction') {
			return <MarketplaceDepositPopup closeAction={this.closePopupAction} />;
		}

		if (transactionPopup === 'pendingTransaction') {
			return <MarketplaceTransactionProcessingPopup closeAction={this.closePopupAction} />;
		}

		if (transactionPopup === 'confirmWithdrawTransaction') {
			return <MarketplaceReturnDepositPopup closeAction={this.closePopupAction} />;
		}
		if (transactionPopup === 'noBalance') {
			return <MarketplaceWithoutBalancePopup closeAction={this.closePopupAction} />;
		}
		return '';
	}

	render() {
		let unlockAction = this.unlockAction;
		let item = this.props.item;
		let { stake, transactionPopup } = this.props;
		item = { ...item };
		item.integration = 'Unlock marketplace';
		if (item.status === 'Inactive') {
			item.integration = 'Coming Soon';
			unlockAction = null;
		} else if (this.props.pendingTransaction) {
			item.status = 'pending';
			item.integration = 'Pending KEY deposit';
			if (this.props.pendingTransaction.action === 'withdrawStake') {
				item.integration = 'Pending KEY return';
			}
			unlockAction = null;
		} else if (stake && +stake.balance && +stake.releaseDate) {
			item.status = 'locked';
			item.integration = 'KEY Deposit';
			item.releaseDate = stake.releaseDate;
			unlockAction = null;
		} else if (stake && +stake.balance && !+stake.releaseDay) {
			item.status = 'unlocked';
			item.integration = 'Return KEY Deposit';
			unlockAction = this.returnAction;
		}
		return (
			<div>
				{transactionPopup ? this.renderPopup() : ''}
				<MarketplaceServiceDetails
					{...this.props}
					item={item}
					unlockAction={unlockAction}
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
