import isOnline from 'is-online';
import { appOperations } from 'common/app';

const NETWORK_CHECK_INTERVAL = 5000;

export class NetworkService {
	constructor({ store }) {
		this.store = store;
		this.timeout = null;
	}
	async start() {
		if (this.timeout) this.stop();
		let hasNetwork = await isOnline();
		if (!hasNetwork) {
			hasNetwork = await isOnline();
		}
		await this.store.dispatch(appOperations.networkStatusUpdateOperation(hasNetwork));
		this.timeout = setTimeout(() => {
			return this.start();
		}, NETWORK_CHECK_INTERVAL);
	}

	stop() {
		clearTimeout(this.timeout);
	}
}

export default NetworkService;
