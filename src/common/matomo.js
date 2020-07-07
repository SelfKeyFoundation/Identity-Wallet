import ReactPiwik from 'react-piwik';
import config from './config';

export const matomoGoalTracking = goal => {
	ReactPiwik.push(['trackGoal', goal]);
};

export const matomoGoals = {
	CreateSelfKeyId: config.matomoSite === 1 ? 1 : 5,
	// TODO: implement more goals in feature/910
	CreateIndividualDID: 11,
	MarketplaceVisitIndividualExchange: 12,
	MarketplaceVisitIndividualIncorporations: 13,
	MarketplaceVisitIndividualPassports: 14,
	MarketplaceVisitIndividualBankAccounts: 15,
	MarketplaceVisitIndividualNotaries: 16,
	MarketplaceVisitIndividualLoans: 17,
	MarketplaceVisitCorporateExchange: 18,
	MarketplaceVisitCorporateIncorporations: 19,
	MarketplaceVisitCorporatePassports: 20,
	MarketplaceVisitCorporateBankAccounts: 21,
	MarketplaceVisitCorporateNotaries: 22,
	MarketplaceVisitCorporateLoans: 23,
	CreateCorporateDID: 24
};
