import { EventEmitter } from 'events';

export class SchedulerJob extends EventEmitter {
	constructor(config, jobHandler) {
		super();
		this.config = config;
		this.jobHandler = jobHandler;
		this.additionalJobs = [];
	}
	execute() {
		return this.jobHandler.execute(this);
	}
	emitProgress(progress, data) {
		this.emit('progress', progress, data);
	}
	hasJobs() {
		return this.additionalJobs.length > 0;
	}
	getJobs() {
		return this.additionalJobs;
	}
}

export default SchedulerJob;
