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
	SCHEDULER_QUEUE_SET_CONFIG: 'scheduler/queue/SET_CONFIG'
};

export const schedulerActions = {
	queueJobAction: (id, category, at, data) => ({
		type: schedulerTypes.SCHEDULER_JOB_QUEUE,
		payload: {
			id,
			category,
			at,
			data
		}
	}),
	processJobAction: (id, processTs) => ({
		type: schedulerTypes.SCHEDULER_JOB_PROCESS,
		payload: { id, processTs }
	}),
	finishJobAction: (id, finishTs, finishStatus, result) => ({
		type: schedulerTypes.SCHEDULER_JOB_FINISH,
		payload: { id, finishStatus, result, finishTs }
	}),
	progressJobAction: (id, progressTs, progress, data) => ({
		type: schedulerTypes.SCHEDULER_JOB_PROGRESS,
		payload: { id, progressTs, progress, data }
	}),
	cancelJobAction: (id, finishTs, data) => ({
		type: schedulerTypes.SCHEDULER_JOB_FINISH,
		payload: { id, finishTs, finishStatus: 'canceled', data }
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
		const job = { ...action.payload, data: { ...action.payload.data } };
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
	selectJob: (state, id) => schedulerSelectors.selectScheduler(state).jobsById[id]
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
