import ReactPiwik from 'react-piwik';
import config from './config';

export const matomoGoalTracking = goal => {
	ReactPiwik.push(['trackGoal', goal]);
};

export const matomoGoals = {
	CreateSelfKeyId: config.matomoSite === 1 ? 1 : 5
	// TODO: implement more goals in feature/910
};
