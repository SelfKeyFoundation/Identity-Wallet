import {
	schedulerActions,
	schedulerTypes,
	schedulerInitialState,
	reducers,
	schedulerSelectors
} from './index';

import sinon from 'sinon';

describe('scheduler', () => {
	describe('actions', () => {
		it('queueJobAction', () => {
			const payload = {
				id: 'test1',
				category: 'test',
				at: 10000000,
				data: { test: true },
				strategy: 'test'
			};
			expect(
				schedulerActions.queueJobAction(
					payload.id,
					payload.category,
					payload.at,
					payload.data,
					payload.strategy
				)
			).toEqual({
				type: schedulerTypes.SCHEDULER_JOB_QUEUE,
				payload
			});
		});
		it('processJobAction', () => {
			const id = 'test1';
			const processTs = 10000;
			expect(schedulerActions.processJobAction(id, processTs)).toEqual({
				type: schedulerTypes.SCHEDULER_JOB_PROCESS,
				payload: { id, processTs }
			});
		});
		it('finishJobAction', () => {
			const id = 'test1';
			const finishStatus = 'success';
			const result = { test: '123' };
			const finishTs = 100000;
			const category = 'test';
			expect(
				schedulerActions.finishJobAction(id, category, finishTs, finishStatus, result, {})
			).toEqual({
				type: schedulerTypes.SCHEDULER_JOB_FINISH,
				payload: { id, category, finishStatus, result, finishTs, data: {} }
			});
		});
		it('progressJobAction', () => {
			const id = 'test1';
			const progress = 80;
			const data = { test: '123' };
			const progressTs = 1000;
			expect(schedulerActions.progressJobAction(id, progressTs, progress, data)).toEqual({
				type: schedulerTypes.SCHEDULER_JOB_PROGRESS,
				payload: { id, progress, data, progressTs }
			});
		});
		it('cancelJobAction', () => {
			const id = 'test1';
			const result = { test: '123' };
			const finishTs = 1000;
			const category = 'test';
			expect(schedulerActions.cancelJobAction(id, category, finishTs, result, {})).toEqual({
				type: schedulerTypes.SCHEDULER_JOB_FINISH,
				payload: { id, category, result, finishTs, finishStatus: 'canceled', data: {} }
			});
		});
		it('deleteJobAction', () => {
			const id = 'test1';

			expect(schedulerActions.deleteJobAction(id)).toEqual({
				type: schedulerTypes.SCHEDULER_JOB_DELETE,
				payload: id
			});
		});
		it('setQueueProcessing', () => {
			const processing = true;
			expect(schedulerActions.setProcessingQueueAction(processing)).toEqual({
				type: schedulerTypes.SCHEDULER_QUEUE_SET_PROCESSING,
				payload: processing
			});
		});
		it('setQueueConfig', () => {
			const config = { test: true };
			expect(schedulerActions.setConfigQueueAction(config)).toEqual({
				type: schedulerTypes.SCHEDULER_QUEUE_SET_CONFIG,
				payload: config
			});
		});
	});
	describe('reducers', () => {
		it('setConfigQueueReducer', () => {
			const state = { ...schedulerInitialState };
			const config = { test: true };
			const action = schedulerActions.setConfigQueueAction(config);
			expect(state.config).toEqual({});
			expect(reducers.setConfigQueueReducer(state, action)).toEqual({
				...state,
				config
			});
		});
		it('setProcessingQueueReducer', () => {
			const state = { ...schedulerInitialState };
			let processing = true;

			let action = schedulerActions.setProcessingQueueAction(processing);
			expect(state.processing).toBe(false);
			expect(reducers.setProcessingQueueReducer(state, action)).toEqual({
				...state,
				processing
			});
		});
		it('queueJobReducer', () => {
			const state = { ...schedulerInitialState };
			const job = {
				id: 'test1',
				category: 'test',
				at: 10000000,
				data: { test: true },
				strategy: 'test'
			};

			let action = schedulerActions.queueJobAction(
				job.id,
				job.category,
				job.at,
				job.data,
				job.strategy
			);
			expect(state.queue).toEqual([]);
			expect(state.jobsById).toEqual({});
			expect(reducers.queueJobReducer(state, action)).toEqual({
				...state,
				queue: [job.id],
				jobsById: { [job.id]: job }
			});
		});
		it('processJobReducer', () => {
			const id = 'test1';
			const job = { id, category: 'test', at: 10000000, data: { test: true } };
			const state = {
				...schedulerInitialState,
				queue: [id],
				jobsById: {
					[id]: job
				}
			};

			const processTs = 1000;

			let action = schedulerActions.processJobAction(id, processTs);
			expect(state.processingJobs).toEqual([]);

			expect(reducers.processJobReducer(state, action)).toEqual({
				...state,
				queue: [],
				processingJobs: [id],
				jobsById: { [id]: { ...job, processTs } }
			});
		});
		it('finishJobReducer processing', () => {
			const id = 'test1';
			const job = { id, category: 'test', at: 10000000, data: { test: true } };
			const state = {
				...schedulerInitialState,
				processingJobs: [id],
				jobsById: {
					[id]: job
				}
			};

			const finishTs = 1000;
			const finishStatus = 'success';
			const result = { finished: true };

			let action = schedulerActions.finishJobAction(
				id,
				'test',
				finishTs,
				finishStatus,
				result,
				{}
			);
			expect(state.finished).toEqual([]);

			expect(reducers.finishJobReducer(state, action)).toEqual({
				...state,
				queue: [],
				processingJobs: [],
				finished: [id],
				jobsById: { [id]: { ...job, finishTs, finishStatus, result } }
			});
		});
		it('finishJobReducer queue', () => {
			const id = 'test1';
			const job = { id, category: 'test', at: 10000000, data: { test: true } };
			const state = {
				...schedulerInitialState,
				queue: [id],
				jobsById: {
					[id]: job
				}
			};

			const finishTs = 1000;
			const finishStatus = 'success';
			const result = { finished: true };

			let action = schedulerActions.finishJobAction(
				id,
				'test',
				finishTs,
				finishStatus,
				result,
				{}
			);
			expect(state.finished).toEqual([]);

			expect(reducers.finishJobReducer(state, action)).toEqual({
				...state,
				processingJobs: [],
				queue: [],
				finished: [id],
				jobsById: { [id]: { ...job, finishTs, finishStatus, result } }
			});
		});
		it('progressJobReducer', () => {
			const id = 'test1';
			const job = { id, category: 'test', at: 10000000, data: { test: true } };
			const progress1 = {
				progress: 30,
				progressTs: 10000,
				data: { progress1: true }
			};

			const state = {
				...schedulerInitialState,
				processingJobs: [id],
				jobsById: {
					[id]: job
				}
			};

			let action = schedulerActions.progressJobAction(
				id,
				progress1.progressTs,
				progress1.progress,
				progress1.data
			);
			expect(state.jobsById[id]).toEqual(job);
			let state2 = reducers.progressJobReducer(state, action);
			expect(state2).toEqual({
				...state,
				queue: [],
				processingJobs: [id],
				jobsById: { [id]: { ...job, progress: [progress1] } }
			});
			const progress2 = { ...progress1, progress: 50, progressTs: 10100 };
			action = schedulerActions.progressJobAction(
				id,
				progress2.progressTs,
				progress2.progress,
				progress2.data
			);

			expect(reducers.progressJobReducer(state2, action)).toEqual({
				...state2,
				jobsById: { [id]: { ...job, progress: [progress1, progress2] } }
			});
		});
		it('deleteJobReducer queue', () => {
			const id = 'test1';
			const job = { id, category: 'test', at: 10000000, data: { test: true } };
			const state = { ...schedulerInitialState, queue: [id], jobsById: { [id]: job } };

			let action = schedulerActions.deleteJobAction(id);

			expect(reducers.deleteJobReducer(state, action)).toEqual({
				...state,
				queue: [],
				finished: [],
				processingJobs: [],
				jobsById: {}
			});
		});
		it('deleteJobReducer processing', () => {
			const id = 'test1';
			const job = { id, category: 'test', at: 10000000, data: { test: true } };
			const state = {
				...schedulerInitialState,
				processingJobs: [id],
				jobsById: { [id]: job }
			};

			let action = schedulerActions.deleteJobAction(id);

			expect(reducers.deleteJobReducer(state, action)).toEqual({
				...state,
				queue: [],
				finished: [],
				processingJobs: [],
				jobsById: {}
			});
		});
		it('deleteJobReducer finished', () => {
			const id = 'test1';
			const job = { id, category: 'test', at: 10000000, data: { test: true } };
			const state = { ...schedulerInitialState, finished: [id], jobsById: { [id]: job } };

			let action = schedulerActions.deleteJobAction(id);

			expect(reducers.deleteJobReducer(state, action)).toEqual({
				...state,
				queue: [],
				finished: [],
				processingJobs: [],
				jobsById: {}
			});
		});
	});
	describe('selectros', () => {
		let state, ts, clock;
		beforeEach(() => {
			state = { scheduler: { ...schedulerInitialState } };
			ts = Date.now();
			clock = sinon.useFakeTimers({ now: ts });
		});

		afterEach(() => {
			clock.restore();
		});

		it('selectScheduler', () => {
			expect(schedulerSelectors.selectScheduler(state)).toEqual(schedulerInitialState);
		});

		it('selectQueued', () => {
			state.scheduler.queue = ['test'];
			state.scheduler.jobsById['test'] = { test: true };
			expect(schedulerSelectors.selectQueued(state)).toEqual([{ test: true }]);
		});

		it('selectFinished', () => {
			state.scheduler.finished = ['test'];
			state.scheduler.jobsById['test'] = { test: true };
			expect(schedulerSelectors.selectFinished(state)).toEqual([{ test: true }]);
		});

		it('selectProcessingJobs', () => {
			state.scheduler.processingJobs = ['test'];
			state.scheduler.jobsById['test'] = { test: true };
			expect(schedulerSelectors.selectProcessingJobs(state)).toEqual([{ test: true }]);
		});

		it('selectJobsToProcess', () => {
			const oldJob = { id: 'old', at: ts - 10 };
			const nowJob = { id: 'now', at: ts };
			const fututreJob = { id: 'future', at: ts + 10 };
			state.scheduler.queue = [oldJob.id, nowJob.id, fututreJob.id];
			state.scheduler.jobsById[nowJob.id] = nowJob;
			state.scheduler.jobsById[oldJob.id] = oldJob;
			state.scheduler.jobsById[fututreJob.id] = fututreJob;
			expect(schedulerSelectors.selectJobsToProcess(state)).toEqual([oldJob, nowJob]);
		});

		it('selectJob', () => {
			const oldJob = { id: 'old', at: ts - 10 };
			const nowJob = { id: 'now', at: ts };
			const fututreJob = { id: 'future', at: ts + 10 };
			state.scheduler.queue = [oldJob.id, nowJob.id, fututreJob.id];
			state.scheduler.jobsById[nowJob.id] = nowJob;
			state.scheduler.jobsById[oldJob.id] = oldJob;
			state.scheduler.jobsById[fututreJob.id] = fututreJob;
			expect(schedulerSelectors.selectJob(state, oldJob.id)).toEqual(oldJob);
		});

		it('isSchedulerProcessing', () => {
			state.scheduler.processing = true;
			expect(schedulerSelectors.isSchedulerProcessing(state)).toBe(true);

			state.scheduler.processing = false;
			expect(schedulerSelectors.isSchedulerProcessing(state)).toBe(false);
		});
	});
	// describe('operations', () => {
	// 	let state, ts, clock;
	// 	beforeEach(() => {
	// 		state = { scheduler: { ...schedulerInitialState } };
	// 		ts = Date.now();
	// 		clock = sinon.useFakeTimers({ now: ts });
	// 	});

	// 	afterEach(() => {
	// 		clock.restore();
	// 	});

	// 	it('processJobsOperations', async () => {});
	// });
});
