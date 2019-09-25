import config from 'common/config';

const featureIsEnabled = featureName => {
	const snakeCase = featureName
		.split(/(?=[A-Z])/)
		.join('_')
		.toUpperCase();
	// env variables format for features is FEATURE_NAME_IN_SNAKE_CASE
	if (process.env.hasOwnProperty(`FEATURE_${snakeCase}`)) {
		return !!+process.env[`FEATURE_${snakeCase}`];
	}
	return !!config.features[featureName];
};

export { featureIsEnabled };
