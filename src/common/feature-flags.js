import config from './config';

const featureIsEnabled = featureName => !!config.features[featureName];

export { featureIsEnabled };
