import KycApplication from './kyc-application';
// import { Logger } from 'common/logger';
// import { getGlobalContext } from 'common/context';
// const log = new Logger('kyc-applications-service');

export class KycApplicationService {
	addEntry = entry => {
		if (this.findById(entry.id)) {
			return this.editEntry(entry);
		} else {
			return KycApplication.create(entry);
		}
	};

	editEntry = entry => {
		return KycApplication.update(entry);
	};

	deleteEntryById = id => {
		return KycApplication.delete(id);
	};

	findById = id => {
		return KycApplication.findById(id);
	};

	load = _ => {
		return KycApplication.findAll();
	};
}

export default KycApplicationService;
