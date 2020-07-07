import ReactPiwik from 'react-piwik';
import config from './config';
import { ipcRenderer } from 'electron';
import md5 from 'md5';
import { Logger } from 'common/logger';

import { isTestMode } from 'common/utils/common';

import { appSelectors } from 'common/app';

const log = new Logger('matomo-service');

export class MatomoService {
	constructor({ store, matomoGoals }) {
		this.connectedHistory = null;
		this.trackingAllowed = false;
		this.userId = null;
		this.store = store;
		this.goals = matomoGoals;
		this.init();
		this.stateSubscribe();
		this.listenToMain();
	}

	init() {
		this.m = new ReactPiwik({
			url: config.matomoUrl,
			siteId: config.matomoSite,
			trackErrors: true
		});
		this.m.push(['setUserId', window.machineId]);
		this.m.push(['setCustomVariable', 3, 'walletVersion', window.appVersion, 'visit']);

		this.rawPush = this.m.push.bind(this.m);

		this.m.push = (args, bypass) => {
			if (isTestMode()) {
				return;
			}
			if (this.hasConcent || bypass) {
				return this.rawPush(args);
			}
		};
		log.info('init complete');
	}

	destroy() {
		this.disconnectFromHistory();
		this.stateUnsubscribe();
		this.m.push = this.rawPush;
		this.m = null;
	}

	stateSubscribe() {
		if (this._unsubscribe) {
			this._unsubscribe();
		}
		this._unsubscribe = this.store.subscribe(() => {
			const hasAcceptedTracking = appSelectors.hasAcceptedTracking(this.store.getState());
			if (hasAcceptedTracking === this.hasConcent()) return;
			this.grantConcent(hasAcceptedTracking);
		});
		log.info('listen to state');
	}
	stateUnsubscribe() {
		if (this._unsubscribe) {
			this._unsubscribe();
		}
		this._unsubscribe = false;
		log.info('not listening to state');
	}

	listenToMain() {
		if (!ipcRenderer) {
			return;
		}

		const allowedActions = ['push', 'track', 'trackGoal', 'setWalletContext', 'grantConcent'];

		ipcRenderer.on('matomo-action', (event, payload) => {
			const [action, ...args] = payload;
			log.debug('action from main %s %j', action, args);
			if (!allowedActions.includes(action)) return;
			this[action].apply(this, args);
		});
	}

	setWalletContext(address, type) {
		this.walletContext = {
			address,
			type
		};
		if (this.hasConcent()) {
			this._applyWalletContext();
		}
	}

	_applyWalletContext() {
		if (!this.walletContext) return;
		this.push(['setCustomVariable', 1, 'walletId', md5(this.walletContext.address), 'visit']);
		this.push(['setCustomVariable', 2, 'walletType', this.walletContext.type, 'visit']);
	}

	push(args, bypass) {
		return this.m.push(args, bypass);
	}

	track(loc) {
		return this.m.track(loc);
	}

	trackGoal(goal) {
		this.push(['trackGoal', goal]);
	}

	hasConcent() {
		return this.trackingAllowed;
	}

	grantConcent(isAllowed) {
		if (this.trackingAllowed === isAllowed) return;
		this.trackingAllowed = isAllowed;
		if (!isAllowed) {
			this.disconnectFromHistory();
			return;
		}
		ReactPiwik.push(['trackPageView']);
		ReactPiwik.push(['enableHeartBeatTimer']);
		ReactPiwik.push(['trackAllContentImpressions']);
		if (this.walletContext) {
			this._applyWalletContext();
		}
	}

	connectToHistory(history) {
		this.connectedHistory = history;
		if (this.hasConcent()) {
			this.m.connectToHistory();
		}
	}

	disconnectFromHistory() {
		this.m.disconnectFromHistory();
		if (this.connectedHistory) {
			this.connectedHistory = null;
		}
	}
}

export default MatomoService;
