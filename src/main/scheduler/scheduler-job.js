import { EventEmitter } from 'events';

import { Logger } from 'common/logger';
import { STRATEGIES_MAP } from './strategies';

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
			this.finalize(null, results);
			return results;
		} catch (error) {
			log.error(error);
			this.finalize(error);
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
		log.debug('adding job %2j', job);
		this.additionalJobs.push(job);
	}
	finalize(err, result) {
		const { strategy } = this.config;

		if (!strategy) {
			return;
		}
		if (err) {
			return this.implementStrategy(strategy.error);
		}
		this.implementStrategy(strategy.success);
	}
	implementStrategy(strategyConfig) {
		if (!strategyConfig) {
			return;
		}
		if (!STRATEGIES_MAP[strategyConfig.name]) {
			throw new Error('Unknown strategy');
		}
		try {
			const strategy = new STRATEGIES_MAP[strategyConfig.name](strategyConfig);
			return strategy.implement(this);
		} catch (error) {
			log.error(error);
		}
	}
}

export default SchedulerJob;
