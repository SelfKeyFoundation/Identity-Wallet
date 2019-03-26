import ReactPiwik from 'react-piwik';

export const matomoGoalTracking = goal => {
	ReactPiwik.push(['trackGoal', goal]);
};

export const matomoGoals = {
	CreateSelfKeyId: 1
	// TODO: implement more goals in feature/910
};
