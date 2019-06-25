import { SchedulerJob } from './scheduler-job';
import { schedulerOperations } from 'common/scheduler';
import { Logger } from '../../common/logger';

const log = new Logger('Scheduler Service');
export class SchedulerService {
	constructor({ store }) {
		this.store = store;
		this.registry = {};
	}
	queueJob(id = null, category, at = 0, data) {
		log.info('queuing job %s', category);
		this.store.dispatch(schedulerOperations.queueJobAction(id, category, at, data));
	}
	registerJobHandler(category, handler) {
		log.info('registering new handler: %s', category);
		this.registry[category] = handler;
	}
	unregisterJobHandler(category) {
		delete this.registry[category];
	}
	initJob(config) {
		if (!this.registry.hasOwnProperty(config.category)) {
			log.error('no handler for category %s', config.category);
			return null;
		}

		return new SchedulerJob(config, this.registry[config.category]);
	}
}
