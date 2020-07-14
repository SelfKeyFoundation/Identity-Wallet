import ReactPiwik from 'react-piwik';
import config from 'common/config';
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
		ReactPiwik.push(['setUserId', window.machineId]);
		ReactPiwik.push(['setCustomVariable', 3, 'walletVersion', window.appVersion, 'visit']);

		this.rawPush = ReactPiwik.push;

		ReactPiwik.push = (args, bypass) => {
			if (isTestMode()) {
				return;
			}
			log.debug('pushing event with concent %s: %j', this.hasConcent(), args);
			if (this.hasConcent() || bypass) {
				return this.rawPush.call(ReactPiwik, args);
			}
		};
		log.debug('init complete');
	}

	destroy() {
		this.disconnectFromHistory();
		this.stateUnsubscribe();
		ReactPiwik.push = this.rawPush;
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
		log.debug('listen to state');
	}
	stateUnsubscribe() {
		if (this._unsubscribe) {
			this._unsubscribe();
		}
		this._unsubscribe = false;
		log.debug('not listening to state');
	}

	listenToMain() {
		if (!ipcRenderer) {
			return;
		}

		const allowedActions = [
			'push',
			'track',
			'trackGoal',
			'trackEvent',
			'setWalletContext',
			'grantConcent'
		];

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
		return ReactPiwik.push(args, bypass);
	}

	track(loc) {
		return this.m.track(loc);
	}

	trackEvent(category, action, name, value, bypass) {
		this.push(['trackEvent', category, action, name, value], bypass);
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
		this.push(['trackPageView']);
		this.push(['enableHeartBeatTimer']);
		this.push(['trackAllContentImpressions']);
		if (this.walletContext) {
			this._applyWalletContext();
		}
	}

	connectToHistory(history) {
		this.connectedHistory = history;
		if (this.hasConcent()) {
			return this.m.connectToHistory(history);
		}
		return history;
	}

	disconnectFromHistory() {
		this.m.disconnectFromHistory();
		if (this.connectedHistory) {
			this.connectedHistory = null;
		}
	}
}

export default MatomoService;
