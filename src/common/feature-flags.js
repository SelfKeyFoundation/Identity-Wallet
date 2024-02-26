import config from 'common/config';

const featureIsEnabled = featureName => {
	const snakeCase = featureName
		.split(/(?=[A-Z])/)
		.join('_')
		.toUpperCase();

	if (featureName === 'eip_1559') {
		return true;
	}

	// env variables format for features is FEATURE_NAME_IN_SNAKE_CASE
	if (process.env.hasOwnProperty(`FEATURE_${snakeCase}`)) {
		return !!+process.env[`FEATURE_${snakeCase}`];
	}
	return !!config.features[featureName];
};

const featureIsDisabled = featureName => !featureIsEnabled(featureName);

export { featureIsEnabled, featureIsDisabled };
