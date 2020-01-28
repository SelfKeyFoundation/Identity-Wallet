import { inventorySelectors } from '../inventory';
import config from 'common/config';

const selectPrice = item => {
	const { data: notary } = item;
	if (!notary.price) return 25;
	let price = `${notary.price}`;

	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

const selectTemplate = item => {
	const { data: notary } = item;
	if (!notary.templateId) return null;
	const templateId = notary.templateId;
	return templateId;
};

const selectVendorWalletAddress = item => {
	const { data: program } = item;
	if (config.dev) {
		return program.testWalletAddress ? program.testWalletAddress : config.testWalletAddress;
	} else {
		return program.walletAddress;
	}
};

const selectVendorDidAddress = item => {
	const { data: program } = item;
	if (config.dev) {
		return program.testDidAddress ? program.testDidAddress : config.testDidAddress;
	} else {
		return program.didAddress;
	}
};

const parseOptions = item => {
	const { data: program } = item;
	if (!program.walletOptions) {
		return [];
	}
	const options = program.walletOptions;

	const strArray = options.split('-');

	const optionsArray = strArray.map((text, idx) => {
		if (!text) return false;
		let price = text.match(/\(.*\)/);
		let notes = text.match(/\[.*\]/);
		const id = `options-${idx}`;
		price = price ? price[0].replace('(', '').replace(')', '') : '';
		price = price ? parseInt(price) : '';
		notes = notes ? notes[0].replace('[', '').replace(']', '') : '';
		const description = text
			.replace(/\(.*\)/, '')
			.replace(/\[.*\]/, '')
			.trim();

		return { price, notes, description, id };
	});

	return optionsArray.filter(el => el !== false);
};

export const notariesSelectors = {
	selectNotaries: state =>
		inventorySelectors.selectInventoryForCategory(state, 'notaries').map(b => {
			console.log('HELLO');
			console.log(b);
			b.price = selectPrice(b);
			b.templateId = selectTemplate(b);
			b.data.checkoutOptions = parseOptions(b);
			b.accountType = b.data.type ? b.data.type.toLowerCase() : null;
			b.walletAddress = selectVendorWalletAddress(b);
			b.didAddress = selectVendorDidAddress(b);
			return b;
		}),
	selectNotaryTypeByFilter: (state, filter) =>
		notariesSelectors.selectNotaries(state).find(filter)
	// selectNotaryJurisdictionByAccountCode: (state, accountCode) =>
	// 	notariesSelectors.selectNotaries(state).find(n => n.data.accountCode === accountCode)
};

export default notariesSelectors;
