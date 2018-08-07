const path = require('path');
const fs = require('fs');

const walkSync = (dir, filelist = []) => {
	fs.readdirSync(dir).forEach(file => {
		const dirFile = path.join(dir, file);
		try {
			filelist = walkSync(dirFile, filelist);
		} catch (err) {
			if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
			else throw err;
		}
	});
	return filelist;
};

module.exports = {
	walkSync
};
