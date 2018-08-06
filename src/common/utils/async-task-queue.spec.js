import sinon from 'sinon';
import { AsyncTaskQueue } from './async-task-queue';

describe('AsyncTaskQueue', () => {
	const DELAY = 500;
	let queue, executed, clock;
	const taskExecutor = task => {
		return new Promise((resolve, reject) => {
			if (task === 0) {
				executed.push(task);
				resolve(task);
				return;
			}
			setTimeout(() => {
				executed.push(task);
				resolve(task);
			}, task);
			clock.tick(task);
		});
	};

	beforeEach(() => {
		executed = [];
		clock = sinon.useFakeTimers({ now: Date.now() });
		queue = new AsyncTaskQueue(taskExecutor, DELAY);
	});
	afterEach(() => {
		clock.restore();
	});
	it('execute only one task in paralel', async () => {
		queue.delay = 0;
		let promises = [queue.push(30), queue.push(5), queue.push(3)];
		await Promise.all(promises);
		expect(executed).toEqual([30, 5, 3]);
	});
	it('execute only one task in delay interval', async () => {
		let promise = queue.push(0);
		queue.push(0);
		await promise;
		clock.tick(5);
		expect(executed).toEqual([0]);
		clock.tick(queue.delay);
		expect(executed).toEqual([0, 0]);
	});
});
