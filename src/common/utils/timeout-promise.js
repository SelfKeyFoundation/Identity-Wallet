const promiseTimeout = (ms, promise) => {
	// Create a promise that rejects in <ms> milliseconds
	let id = '';
	let timeout = new Promise((resolve, reject) => {
		id = setTimeout(() => {
			clearTimeout(id);
			reject(new Error('Timed out in ' + ms + 'ms.'));
		}, ms);
	});

	// Returns a race between our timeout and the passed in promise
	return {
		promise: Promise.race([promise, timeout]),
		id
	};
};

export default promiseTimeout;
