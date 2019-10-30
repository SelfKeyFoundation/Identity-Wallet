import { EventEmitter } from 'events';

import { Logger } from 'common/logger';

const log = new Logger('Scheduler Job');

export class SchedulerJob extends EventEmitter {
	constructor(config, jobHandler) {
		super();
		this.config = config;
		this.jobHandler = jobHandler;
		this.additionalJobs = [];
	}
	async execute() {
		log.debug(
			'%s: starting job %s %2j',
			this.config.id,
			this.config.category,
			this.config.data
		);
		try {
			const results = await this.jobHandler.execute(this.config.data, this);
			return results;
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
	emitProgress(progress, data) {
		log.debug(
			'%s: progress on job %s: %d %s',
			this.config.id,
			this.config.category,
			progress,
			data.message
		);
		this.emit('progress', progress, data);
	}
	hasJobs() {
		return this.additionalJobs.length > 0;
	}
	getJobs() {
		return this.additionalJobs;
	}
	addJob(job) {
		this.additionalJobs.push(job);
	}
}

export default SchedulerJob;
