import _ from 'lodash';
import { promisify } from 'util';
import async from 'async';

export class AsyncTaskQueue {
	constructor(executor, delay) {
		this.executor = executor;
		this.delay = delay;
		this.q = async.queue(this.handleTask.bind(this), 1);
		this.q.push = promisify(this.q.push);
		this.nextExecution = null;
	}
	handleTask(task, callback) {
		const ts = Date.now();
		let res;
		if (this.nextExecution && ts < this.nextExecution) {
			_.delay(() => this.handleTask(task, callback), this.nextExecution - ts);
			return;
		}
		this.nextExecution = ts + this.delay;
		try {
			res = this.executor(task);
		} catch (err) {
			callback(err);
			return;
		}
		if (res instanceof Promise) {
			res.then(res => callback(null, res)).catch(err => callback(err));
			return;
		}
		callback(null, res);
	}
	push(task) {
		return this.q.push(task);
	}
}

export default AsyncTaskQueue;
