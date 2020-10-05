import { getGlobalContext } from 'common/context';
import BN from 'bignumber.js';
import moment from 'moment';
import { createAliasedAction } from 'electron-redux';

export const initialState = {
	stakeBalance: '0',
	rewardBalance: '0',
	timelockStart: null,
	timelockEnd: null,
	initialized: false,
	minStakePeriod: null,
	minStakeAmount: '0'
};
export const stakingTypes = {
	STAKING_SET: 'staking/SET',
	STAKING_FETCH: 'staking/operations/FETCH'
};
export const stakingActions = {
	setStakingAction: payload => ({ type: stakingTypes.STAKING_SET, payload })
};

const operations = {
	...stakingActions,
	fetchStakeOperation: () => async (dispatch, getState) => {
		const stake = await getGlobalContext().stakingService.fetchStake();

		await dispatch(
			stakingActions.setStakingAction({
				...stake,
				initialized: true
			})
		);
	}
};

export const stakingOperations = {
	...stakingActions,
	fetchStakeOperation: createAliasedAction(
		stakingTypes.STAKING_FETCH,
		operations.fetchStakeOperation
	)
};

export const stakingSelectors = {
	selectStakingTree(state) {
		return state.staking;
	},
	selectStakingInfo(state) {
		const stakingInfo = this.selectStakingTree(state);
		const now = moment().utc();
		const canStake = stakingInfo.initialized;
		const canWithdrawReward = new BN(stakingInfo.rewardBalance).gt(0);
		const hasStaked = new BN(stakingInfo.stakeBalance).gt(0);
		const endDate = moment.utc(stakingInfo.timelockEnd || 0);
		let minStakeDate = null;
		let canWithdrawStake = false;

		if (!hasStaked && canStake) {
			minStakeDate = now.add(stakingInfo.minStakePeriod || 0).valueOf();
		}
		if (canStake && endDate) {
			minStakeDate = moment.max(now, endDate).valueOf();
		}

		if (hasStaked && endDate.isBefore(now)) {
			canWithdrawStake = true;
		}

		return {
			...stakingInfo,
			hasStaked,
			canStake,
			canWithdrawStake,
			canWithdrawReward,
			minStakeDate
		};
	}
};

export const stakingReducers = {
	setStakeReducer: (state, { payload }) => {
		return { ...payload };
	}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case stakingTypes.STAKING_SET:
			return stakingReducers.setStakeReducer(state, action);
	}
	return state;
};

export const testExports = { operations };
