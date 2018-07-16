export const compareLevels = (passLevel, checkLevel) => {
	const LEVELS = ['error', 'warn', 'info', 'verbose', 'debug', 'trace'];
	const pass = LEVELS.indexOf(passLevel);
	const check = LEVELS.indexOf(checkLevel);
	if (check === -1 || pass === -1) {
		return false;
	}
	return check <= pass;
};

export const createFilter = ({ filters, filterLevels }) => {
	if (!filters) return () => false;

	filters = filters.split(',').map(f => new RegExp(f));

	if (filterLevels) {
		filterLevels.split(',');
	}

	return (level, msg) => {
		if (filterLevels && !filterLevels.contains(level)) {
			return false;
		}
		for (let filter of filters) {
			if (msg.match(filter)) return false;
		}
		return true;
	};
};

export const errToStr = error => {
	const hasStack = error instanceof Error && error.stack;
	const errStr = '' + error;
	if (!hasStack) return errStr;
	const stackStr = '' + error.stack;
	if (stackStr.startsWith(errStr)) return stackStr;
	return errStr;
};
