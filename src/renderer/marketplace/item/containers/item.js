import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getItemDetails, hasBalance } from 'common/exchanges/selectors';
import { marketplacesSelectors, marketplacesOperations } from 'common/marketplaces';
import { ItemDetails } from 'selfkey-ui';
import { Logger } from 'common/logger';

const log = new Logger('marketplace-item-container');

const mapStateToProps = (state, props) => {
	let item = getItemDetails(state, props.name);
	let id = `${item.serviceOwner}_${item.serviceId}`;
	return {
		item,
		hasBalance: hasBalance(state, props.name),
		stake: marketplacesSelectors.stakeSelector(state, id),
		pendingTransaction: marketplacesSelectors.pendingTransactionSelector(
			state,
			item.serviceOwner,
			item.serviceId
		)
	};
};

class ItemDetailsContainer extends Component {
	componentDidMount() {
		this.props.dispatch(marketplacesOperations.loadTransactions());
		this.props.dispatch(marketplacesOperations.loadStakes());
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
	render() {
		let unlockAction = this.props.unlockAction;
		let item = this.props.item;
		let { stake } = this.props;
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
			unlockAction = this.props.returnAction;
		}
		return <ItemDetails {...this.props} unlockAction={unlockAction} />;
	}
}

export default connect(mapStateToProps)(ItemDetailsContainer);
