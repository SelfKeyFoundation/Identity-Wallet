const { desktopCapturer } = require('electron');

window.navigator.mediaDevices.getDisplayMedia = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });

			let index = sources.findIndex(
				s => s.name === 'SelfKey Identity Wallet QR Code Scanner'
			);
			index = index === -1 ? 0 : index;

			if (sources[index]) {
				const stream = await window.navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: sources[0].id
						}
					}
				});
				resolve(stream);
			}
			return;
		} catch (err) {
			console.error('Error displaying desktop capture sources:', err);
			reject(err);
		}
	});
};
