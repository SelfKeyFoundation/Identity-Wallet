import { schedulerActions, schedulerTypes, schedulerInitialState, reducers } from './index';

describe('scheduler', () => {
	describe('actions', () => {
		it('queueJobAction', () => {
			const payload = { id: 'test1', category: 'test', at: 10000000, data: { test: true } };
			expect(
				schedulerActions.queueJobAction(
					payload.id,
					payload.category,
					payload.at,
					payload.data
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
			expect(schedulerActions.finishJobAction(id, finishTs, finishStatus, result)).toEqual({
				type: schedulerTypes.SCHEDULER_JOB_FINISH,
				payload: { id, finishStatus, result, finishTs }
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
			const data = { test: '123' };
			const finishTs = 1000;
			expect(schedulerActions.cancelJobAction(id, finishTs, data)).toEqual({
				type: schedulerTypes.SCHEDULER_JOB_FINISH,
				payload: { id, data, finishTs, finishStatus: 'canceled' }
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
			const job = { id: 'test1', category: 'test', at: 10000000, data: { test: true } };

			let action = schedulerActions.queueJobAction(job.id, job.category, job.at, job.data);
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
		it('finishJobReducer', () => {
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

			let action = schedulerActions.finishJobAction(id, finishTs, finishStatus, result);
			expect(state.finished).toEqual([]);

			expect(reducers.finishJobReducer(state, action)).toEqual({
				...state,
				queue: [],
				processingJobs: [],
				finished: [id],
				jobsById: { [id]: { ...job, finishTs, finishStatus, result } }
			});
		});
	});
});
