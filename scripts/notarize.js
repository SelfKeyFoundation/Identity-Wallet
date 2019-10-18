require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
	const { electronPlatformName, appOutDir } = context;
	if (
		electronPlatformName !== 'darwin' ||
		(!process.env.NOTARIZE && !['master'].includes(process.env.CIRCLE_BRANCH))
	) {
		return;
	}

	const appName = context.packager.appInfo.productFilename;

	return notarize({
		appBundleId: 'org.selfkey.wallet',
		appPath: `${appOutDir}/${appName}.app`,
		appleId: process.env.APPLEID,
		appleIdPassword: process.env.APPLEIDPASS
	});
};
