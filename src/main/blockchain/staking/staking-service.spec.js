import { StakingService } from './staking-service';
import sinon from 'sinon';

describe('StakingService', () => {
	let service = null;
	beforeEach(() => {
		service = new StakingService({
			contractService: {
				findByType: () => {
					return [];
				}
			}
		});
	});
	afterEach(() => {
		sinon.restore();
	});
	xit('should fetch stake', async () => {
		const stake = await service.fetchStake();

		expect(stake).toMatchObject({
			stakeBalance: '160000',
			rewardBalance: '8000',
			minStakeAmount: '10000'
		});

		expect(stake.timelockStart).toBeTruthy();
		expect(stake.timelockEnd).toBeTruthy();
	});
});
