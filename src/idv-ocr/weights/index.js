import * as faceapi from 'face-api.js';

import { faceDetectionNet } from '../commons';

async function loadWeights() {
	let cwd = __dirname;
	console.info(`Start loading weights from disk (${cwd}).`);
	await faceDetectionNet.loadFromDisk(cwd);
	console.info(`Loaded (faceDetectionNet).`);
	await faceapi.nets.faceLandmark68Net.loadFromDisk(cwd);
	console.info(`Loaded (faceLandmark68Net).`);
	await faceapi.nets.faceRecognitionNet.loadFromDisk(cwd);
	console.info(`Loaded (faceRecognitionNet).`);
	await faceapi.nets.ssdMobilenetv1.loadFromDisk(cwd);
	console.info(`Loaded (ssdMobilenetv1).`);
	console.info(`Done loading weights from disk (${cwd}).`);
}

export const loadIdvOcr = loadWeights();
