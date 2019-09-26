import KycApplication from './kyc-application';
// import { Logger } from 'common/logger';
// import { getGlobalContext } from 'common/context';
// const log = new Logger('kyc-applications-service');

export class KycApplicationService {
	addEntry = async entry => {
		const found = await this.findById(entry.id);
		if (found) {
			return this.editEntry(entry);
		} else {
			return KycApplication.create(entry);
		}
	};

	editEntry = entry => {
		// Don't update rpName or title, they should be
		// set on creation. Otherwise rp syncing will
		// overwrite this field
		delete entry.rpName;
		delete entry.title;

		return KycApplication.update(entry);
	};

	deleteEntryById = id => {
		return KycApplication.delete(id);
	};

	findById = id => {
		return KycApplication.findById(id);
	};

	load = walletId => {
		return KycApplication.findAll(walletId);
	};
}

export default KycApplicationService;
