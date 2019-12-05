import { Logger } from '../../common/logger';

const log = new Logger('SchedulerStrategy');

export class SchedulerStrategy {
	constructor(config) {
		this.config = config;
	}

	implement(job) {
		throw new Error('not_implemented');
	}
}

export class IntervalStrategy extends SchedulerStrategy {
	static NAME = 'INTERVAL';
	static STANDARD_INTERVAL = 10 * 60 * 60 * 1000;

	implement(job) {
		log.debug('implementing interval strategy for %s %s', job.config.id, job.config.category);
		const category = job.config.category;
		const interval = this.config.interval || this.STANDARD_INTERVAL;
		job.addJob({
			category,
			at: Date.now() + interval,
			strategy: job.config.strategy
		});
	}
}

export class ExponentialBackoffRetryStrategy extends SchedulerStrategy {
	static NAME = 'EXPONENTIAL_BACKOFF_RETRY';

	implement(job) {
		log.debug(
			'implementing exponential backoff strategy for %s %s',
			job.config.id,
			job.config.category
		);
		const { attempts, attempt = 0, exponentBase = 2 } = this.config;
		if (attempts - attempt <= 0) {
			return;
		}
		const category = job.config.category;
		const interval = Math.pow(exponentBase, attempt);
		const newStrategy = { ...job.config.strategy };
		newStrategy.error = {
			...this.config,
			attempt: attempt + 1
		};
		job.addJob({
			category,
			at: Date.now() + interval * 1000,
			strategy: newStrategy
		});
	}
}

export const STRATEGIES_MAP = [IntervalStrategy, ExponentialBackoffRetryStrategy].reduce(
	(acc, curr) => {
		acc[curr.NAME] = curr;
		return acc;
	},
	{}
);
