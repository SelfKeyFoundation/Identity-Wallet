import {
	initialState,
	stakingReducers,
	stakingActions,
	// testExports,
	stakingSelectors
} from './index';
import _ from 'lodash';
import sinon from 'sinon';
import { setGlobalContext } from '../context';
import moment from 'moment';

describe('Staking DucK', () => {
	let stakingService = {};

	let state = {};
	// let store = {
	// 	dispatch() {},
	// 	getState() {
	// 		return state;
	// 	}
	// };
	// const testAction = { test: 'test' };
	beforeEach(() => {
		sinon.restore();
		state = { staking: _.cloneDeep(initialState) };
		setGlobalContext({
			stakingService: stakingService
		});
	});
	describe('Selectors', () => {
		beforeEach(() => {
			state = { staking: { ...initialState } };
		});

		it('selectStakingInfo', () => {
			expect(stakingSelectors.selectStakingInfo(state)).toEqual({
				...initialState,
				hasStaked: false,
				canStake: false,
				canWithdrawStake: false,
				canWithdrawReward: false,
				minStakeDate: null
			});
		});
	});
	// describe('Operations', () => {});
	describe('Reducers', () => {
		it('setStakingReducer', () => {
			let state = { ...initialState };
			const stake = {
				stakeBalance: '160000',
				rewardBalance: '8000',
				timelockStart: moment()
					.utc()
					.subtract(30, 'days')
					.valueOf(),
				timelockEnd: moment()
					.utc()
					.add(30, 'days')
					.valueOf(),
				canStake: true,
				minStakeAmount: '10000'
			};
			let newState = stakingReducers.setStakeReducer(
				state,
				stakingActions.setStakingAction(stake)
			);
			expect(newState).toEqual({
				...stake
			});
		});
	});
});
