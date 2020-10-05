import promiseTimeout from 'common/utils/timeout-promise';
import moment from 'moment';

export class StakingService {
	async fetchStake() {
		await promiseTimeout(2000);
		return {
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
			minStakeAmount: '10000'
		};
	}
}
