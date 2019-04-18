import KycApplication from './kyc-application';
// import { getGlobalContext } from 'common/context';

export class KycApplicationService {
	addEntry = entry => {
		return KycApplication.create(entry);
	};

	editEntry = entry => {
		return KycApplication.update(entry);
	};

	deleteEntryById = id => {
		return KycApplication.delete(id);
	};

	load = _ => {
		return KycApplication.findAll();
	};
}

export default KycApplicationService;
