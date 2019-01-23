import { createHashHistory } from 'history';
let history;

export default {
	create: () => {
		history = createHashHistory();
	},
	getHistory: () => history
};
