import config from './config';

const featureIsEnabled = featureName => {
	if (process.env.hasOwnProperty('FEATURE_PAYMENT_CONTRACT')) {
		return !!process.env.FEATURE_PAYMENT_CONTRACT;
	}
	return !!config.features[featureName];
};

export { featureIsEnabled };
