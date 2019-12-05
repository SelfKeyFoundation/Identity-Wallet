import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';
import uuidv1 from 'uuid/v1';

export const SCHEDULER_INTERVAL = 10000;
export const SCHEDULER_CLEANUP_DELAY = 60000;

export const schedulerInitialState = {
	processing: false,
	processingJobs: [],
	config: {},
	queue: [],
	finished: [],
	jobsById: {}
};

export const schedulerTypes = {
	SCHEDULER_JOB_QUEUE: 'scheduler/job/QUEUE',
	SCHEDULER_JOB_PROCESS: 'scheduler/job/PROCESS',
	SCHEDULER_JOB_FINISH: 'scheduler/job/FINISH',
	SCHEDULER_JOB_PROGRESS: 'scheduler/job/PROGRESS',
	SCHEDULER_JOB_DELETE: 'scheduler/job/DELETE',
	SCHEDULER_QUEUE_SET_PROCESSING: 'scheduler/queue/SET_PROCESSING',
	SCHEDULER_QUEUE_SET_CONFIG: 'scheduler/queue/SET_CONFIG',
	SCHEDULER_START_OPERATION: 'scheduler/operation/START',
	SCHEDULER_STOP_OPERATION: 'scheduler/operation/STOP'
};

export const schedulerActions = {
	queueJobAction: (id, category, at = 0, data, strategy = null) => ({
		type: schedulerTypes.SCHEDULER_JOB_QUEUE,
		payload: {
			id: id || uuidv1(),
			category,
			at,
			data,
			strategy
		}
	}),
	processJobAction: (id, processTs) => ({
		type: schedulerTypes.SCHEDULER_JOB_PROCESS,
		payload: { id, processTs }
	}),
	finishJobAction: (id, category, finishTs, finishStatus, result, data) => ({
		type: schedulerTypes.SCHEDULER_JOB_FINISH,
		payload: { id, category, finishStatus, result, finishTs, data }
	}),
	progressJobAction: (id, progressTs, progress, data) => ({
		type: schedulerTypes.SCHEDULER_JOB_PROGRESS,
		payload: { id, progressTs, progress, data }
	}),
	cancelJobAction: (id, category, finishTs, result, data) => ({
		type: schedulerTypes.SCHEDULER_JOB_FINISH,
		payload: { id, category, finishTs, finishStatus: 'canceled', result, data }
	}),
	deleteJobAction: id => ({
		type: schedulerTypes.SCHEDULER_JOB_DELETE,
		payload: id
	}),
	setProcessingQueueAction: processing => ({
		type: schedulerTypes.SCHEDULER_QUEUE_SET_PROCESSING,
		payload: processing
	}),
	setConfigQueueAction: config => ({
		type: schedulerTypes.SCHEDULER_QUEUE_SET_CONFIG,
		payload: config
	})
};

export const reducers = {
	setConfigQueueReducer: (state, action) => {
		return { ...state, config: { ...action.payload } };
	},
	setProcessingQueueReducer: (state, action) => {
		return { ...state, processing: !!action.payload };
	},
	queueJobReducer: (state, action) => {
		const job = {
			...action.payload,
			data: { ...action.payload.data }
		};
		const jobsById = { ...state.jobsById };
		const queue = state.queue.filter(id => id !== job.id);
		queue.push(job.id);
		jobsById[job.id] = job;
		return { ...state, queue, jobsById };
	},
	processJobReducer: (state, action) => {
		const { id, processTs } = action.payload;
		if (!state.queue.includes(id)) {
			return state;
		}
		const job = { ...state.jobsById[id], processTs };
		const jobsById = { ...state.jobsById, [id]: job };
		const processingJobs = [...state.processingJobs];
		const queue = state.queue.filter(jobId => jobId !== id);
		processingJobs.push(job.id);
		return { ...state, queue, jobsById, processingJobs };
	},
	finishJobReducer: (state, action) => {
		const { id, finishStatus, result, finishTs } = action.payload;
		let { queue, processingJobs, jobsById, finished } = state;
		if (!queue.includes(id) && !processingJobs.includes(id)) {
			return state;
		}
		const job = {
			...state.jobsById[id],
			finishStatus,
			result: { ...result },
			finishTs
		};
		jobsById = { ...jobsById, [id]: job };
		processingJobs = processingJobs.filter(jobId => jobId !== id);
		queue = queue.filter(jobId => jobId !== id);
		finished = [...finished, id];
		return { ...state, queue, jobsById, processingJobs, finished };
	},
	progressJobReducer: (state, action) => {
		const { id, progress, progressTs, data } = action.payload;
		if (!state.jobsById[id] || state.finished.includes(id)) {
			return state;
		}
		const jobsById = { ...state.jobsById };
		jobsById[id] = {
			...jobsById[id],
			progress: [
				...(jobsById[id].progress || []),
				{ progress, progressTs, data: { ...(data || {}) } }
			]
		};
		return { ...state, jobsById };
	},
	deleteJobReducer: (state, action) => {
		let jobsById = { ...state.jobsById };
		delete jobsById[action.payload];
		return {
			...state,
			jobsById,
			queue: state.queue.filter(id => id !== action.payload),
			finished: state.finished.filter(id => id !== action.payload),
			processingJobs: state.finished.filter(id => id !== action.payload)
		};
	}
};

export const operations = {
	...schedulerActions,
	processOneJob: job => async (dispatch, getState) => {
		const schedulerService = getGlobalContext().schedulerService;

		await dispatch(operations.processJobAction(job.id, Date.now()));
		const jobObj = schedulerService.initJob(job);
		if (!jobObj) {
			return dispatch(
				schedulerActions.cancelJobAction(
					job.id,
					job.category,
					Date.now(),
					{
						code: 'no_handler',
						message: 'No handler for this job type'
					},
					job.data
				)
			);
		}
		jobObj.on('progress', (progress, data) => {
			dispatch(schedulerActions.progressJobAction(job.id, Date.now(), progress, data));
		});

		try {
			const result = await jobObj.execute();
			await dispatch(
				schedulerActions.finishJobAction(
					job.id,
					job.category,
					Date.now(),
					'success',
					result,
					job.data
				)
			);
			return result;
		} catch (error) {
			await dispatch(
				schedulerActions.cancelJobAction(job.id, job.category, Date.now(), {
					code: error.code || 'canceled',
					message: error.message || 'Job canceled'
				}),
				job.data
			);
			return error;
		} finally {
			if (jobObj.hasJobs()) {
				await Promise.all(
					jobObj
						.getJobs()
						.map(job =>
							dispatch(
								schedulerOperations.queueJobAction(
									job.id || null,
									job.category,
									job.at,
									job.data,
									job.strategy
								)
							)
						)
				);
			}
		}
	},

	processJobsOperation: () => async (dispatch, getState) => {
		const jobs = schedulerSelectors.selectJobsToProcess(getState());
		return Promise.all(jobs.map(job => dispatch(operations.processOneJob(job))));
	},

	startSchedulerOperation: () => async (dispatch, getState) => {
		if (schedulerSelectors.isSchedulerProcessing(getState())) {
			return;
		}
		await dispatch(operations.setProcessingQueueAction(true));
		while (schedulerSelectors.isSchedulerProcessing(getState())) {
			const ts = Date.now();
			const toClean = schedulerSelectors
				.selectFinished(getState())
				.filter(job => ts - job.finishTs > SCHEDULER_CLEANUP_DELAY);

			await Promise.all(toClean.map(job => dispatch(operations.deleteJobAction(job.id))));

			await dispatch(operations.processJobsOperation());
			await new Promise((resolve, reject) => {
				setTimeout(() => resolve(), SCHEDULER_INTERVAL);
			});
		}
	},

	stopSchedulerOperation: () => async (dispatch, getState) => {
		await dispatch(operations.setProcessingQueueAction(false));
	}
};

export const schedulerOperations = {
	...schedulerActions,
	startSchedulerOperation: createAliasedAction(
		schedulerTypes.SCHEDULER_START_OPERATION,
		operations.startSchedulerOperation
	),
	stopSchedulerOperation: createAliasedAction(
		schedulerTypes.SCHEDULER_STOP_OPERATION,
		operations.stopSchedulerOperation
	)
};

export const schedulerSelectors = {
	selectScheduler: state => state.scheduler,
	selectQueued: state => {
		const { queue, jobsById } = schedulerSelectors.selectScheduler(state);
		return queue.map(id => jobsById[id]);
	},
	selectFinished: state => {
		const { finished, jobsById } = schedulerSelectors.selectScheduler(state);
		return finished.map(id => jobsById[id]);
	},
	selectProcessingJobs: state => {
		const { processingJobs, jobsById } = schedulerSelectors.selectScheduler(state);
		return processingJobs.map(id => jobsById[id]);
	},
	selectJobsToProcess: state => {
		const ts = Date.now();
		return schedulerSelectors.selectQueued(state).filter(job => job.at <= ts);
	},
	selectJob: (state, id) => schedulerSelectors.selectScheduler(state).jobsById[id],
	isSchedulerProcessing: state => !!schedulerSelectors.selectScheduler(state).processing,
	selectProcessingJobsByCategory: (state, category) =>
		schedulerSelectors.selectProcessingJobs(state).filter(job => job.category === category),
	selectQueuedJobsByCategory: (state, category, maxAnticipationTime = null) => {
		const ts = Date.now();
		return schedulerSelectors.selectQueued(state).filter(job => {
			if (maxAnticipationTime !== null && job.at > ts + maxAnticipationTime) {
				return false;
			}
			return job.category === category;
		});
	},
	selectJobsInProgressByCategory: (state, category, maxAnticipationTime = 0) => {
		const processing = schedulerSelectors.selectProcessingJobsByCategory(state, category);
		const queued = schedulerSelectors.selectQueuedJobsByCategory(
			state,
			category,
			maxAnticipationTime
		);
		return [...processing, ...queued];
	}
};

export const schedulerReducer = (state = schedulerInitialState, action) => {
	switch (action.type) {
		case schedulerTypes.SCHEDULER_JOB_QUEUE:
			return reducers.queueJobReducer(state, action);
		case schedulerTypes.SCHEDULER_JOB_PROCESS:
			return reducers.processJobReducer(state, action);
		case schedulerTypes.SCHEDULER_JOB_FINISH:
			return reducers.finishJobReducer(state, action);
		case schedulerTypes.SCHEDULER_JOB_PROGRESS:
			return reducers.progressJobReducer(state, action);
		case schedulerTypes.SCHEDULER_JOB_DELETE:
			return reducers.deleteJobReducer(state, action);
		case schedulerTypes.SCHEDULER_QUEUE_SET_PROCESSING:
			return reducers.setProcessingQueueReducer(state, action);
		case schedulerTypes.SCHEDULER_QUEUE_SET_CONFIG:
			return reducers.setConfigQueueReducer(state, action);
	}
	return state;
};

export default schedulerReducer;
