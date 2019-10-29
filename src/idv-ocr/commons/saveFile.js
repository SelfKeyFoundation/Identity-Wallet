import * as fs from 'fs';
import * as path from 'path';

const baseDir = path.resolve(__dirname, '../../output');

export function saveFile(fileName, buf) {
	if (!fs.existsSync(baseDir)) {
		fs.mkdirSync(baseDir);
	}
	console.log(baseDir);
	fs.writeFileSync(path.resolve(baseDir, fileName), buf);
}
