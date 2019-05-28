import { SchedulerJob } from './scheduler-job';
import { schedulerOperations } from 'common/scheduler';

export class SchedulerService {
	constructor({ store }) {
		this.store = store;
		this.registry = {};
	}
	queueJob(id = null, category, at = 0, data) {
		this.store.dispatch(schedulerOperations.queueJobAction(id, category, at, data));
	}
	registerJobHandler(category, handler) {
		this.registry[category] = handler;
	}
	unregisterJobHandler(category) {
		delete this.registry[category];
	}
	initJob(config) {
		if (!this.registry.hasOwnProperty(config.category)) {
			return null;
		}

		return new SchedulerJob(config, this.registry[config.category]);
	}
}
