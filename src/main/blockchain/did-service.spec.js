/* 
import DIDService from './did-service';
import { setGlobalContext } from 'common/context';

describe('DIDService', () => {
	let service = null;
	beforeEach(() => {
		service = new DIDService();
		const ledger = {
			methods: {
				createDID: () => {}
			}
		};

		const web3Service = {
			web3: {
				eth: {
					Contract: () => ledger
				}
			}
		};
		setGlobalContext({ web3Service });
	});

	xit('createDID', async () => {});
	xit('getControllerAddress', async () => {});
});
*/
