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
	}
};
