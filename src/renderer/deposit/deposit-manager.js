import React, { PureComponent } from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { UnlockIcon, ReturnIcon, HourGlassSmallIcon, CalendarIcon } from 'selfkey-ui';
import { marketplacesSelectors, marketplacesOperations } from 'common/marketplaces';
import { getServiceDetails, hasBalance } from 'common/exchanges/selectors';

import {
	MarketplaceReturnDepositPopup,
	MarketplaceDepositPopup,
	TransactionProcessingPopup,
	MarketplaceWithoutBalancePopup
} from './transactions';

import { Logger } from 'common/logger';

const log = new Logger('deposit-manager');

const styles = theme => ({
	fullWidth: {
		width: '100%'
	},

	daysLeft: {
		color: '#93B0C1',
		fontSize: '13px'
	},

	unlockButtonText: {
		display: 'flex',
		flexFlow: 'column',
		minWidth: '180px',
		textAlign: 'center'
	},

	unlockIcon: {
		marginRight: '10px'
	},

	hourGlassIcon: {
		marginRight: '10px',
		paddingTop: '1px'
	},

	returnIcon: {
		marginRight: '20px'
	}
});

class DepositMangerComponent extends PureComponent {
	async componentDidMount() {
		await Promise.all([
			this.props.dispatch(marketplacesOperations.loadTransactions()),
			this.props.dispatch(marketplacesOperations.loadStakes())
		]);
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
		log.debug('Will check transaction status in 5 sec');
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

	unlockActionCall(unlockAction, item, hasBalance) {
		if (!unlockAction) {
			return;
		}
		unlockAction(hasBalance);
	}

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

	renderPopup() {
		const { transactionPopup } = this.props;
		if (transactionPopup === 'confirmStakeTransaction') {
			return <MarketplaceDepositPopup closeAction={this.closePopupAction} />;
		}

		if (transactionPopup === 'pendingTransaction') {
			return (
				<TransactionProcessingPopup
					closeAction={this.closePopupAction}
					title="KEY Deposit"
				/>
			);
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
		let { classes, item, hasBalance, transactionPopup } = this.props;
		let daysLeft = 0;
		if (item.status === 'locked' && item.releaseDate) {
			daysLeft = Math.ceil((item.releaseDate - Date.now()) / 1000 / 60 / 60 / 24);
		}
		let { stake } = this.props;
		let unlockAction = this.unlockAction;
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
			<React.Fragment>
				{transactionPopup ? this.renderPopup() : ''}
				<Button
					disabled={['pending', 'Inactive'].includes(item.status)}
					variant={
						['unlocked', 'locked'].includes(item.status) ? 'outlined' : 'contained'
					}
					size="large"
					onClick={() => this.unlockActionCall(unlockAction, item, hasBalance)}
					className={classes.fullWidth}
				>
					{item.status === 'Active' && <UnlockIcon className={classes.unlockIcon} />}
					{item.status === 'pending' && (
						<HourGlassSmallIcon
							width="12px"
							height="16px"
							fill="#FFFFFF"
							className={classes.hourGlassIcon}
						/>
					)}
					{item.status === 'locked' && <CalendarIcon />}
					{item.status === 'unlocked' && <ReturnIcon className={classes.returnIcon} />}
					<div className={classes.unlockButtonText}>
						<span>{item.integration}</span>
						{item.status === 'locked' && daysLeft && (
							<span className={classes.daysLeft}>{daysLeft} days left</span>
						)}
					</div>
				</Button>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	const name = props.relyingPartyName;
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
		transactionPopup: marketplacesSelectors.displayedPopupSelector(state)
	};
};

export const DepositManager = connect(mapStateToProps)(withStyles(styles)(DepositMangerComponent));

export default DepositManager;
