import * as faceapi from 'face-api.js';

import { faceDetectionNet } from '../commons';

async function loadWeights() {
	let cwd = __dirname;
	console.info(`Start loading weights from disk (${cwd}).`);
	await faceDetectionNet.loadFromDisk(cwd);
	await faceapi.nets.faceLandmark68Net.loadFromDisk(cwd);
	await faceapi.nets.faceRecognitionNet.loadFromDisk(cwd);
	console.info(`Done loading weights from disk (${cwd}).`);
}

loadWeights();
