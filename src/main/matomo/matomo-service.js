import { webContents } from 'electron';

export class MatomoService {
	constructor({ matomoGoals }) {
		this.goals = matomoGoals;
	}

	_sendToRenderer(args) {
		if (!webContents) return;

		const allWebContents = webContents.getAllWebContents();

		allWebContents.forEach(contents => {
			contents.send('matomo-action', args);
		});
	}

	setWalletContext(address, type) {
		this._sendToRenderer(['setWalletContext', address, type]);
	}

	push(args, bypass) {
		this._sendToRenderer(['push', args, bypass]);
	}

	track(loc) {
		this._sendToRenderer(['track', loc]);
	}

	trackGoal(goal) {
		this._sendToRenderer(['trackGoal', goal]);
	}

	grantConcent(isAllowed) {
		this._sendToRenderer(['grantConcent', isAllowed]);
	}
}

export default MatomoService;
