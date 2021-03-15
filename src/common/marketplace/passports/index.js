import { inventorySelectors } from '../inventory';
import config from 'common/config';

const selectPrice = item => {
	const { data: program } = item;
	// Check for override ENV variables
	if (config.passportsPriceOverride) return config.passportsPriceOverride;
	if (!program.price && !program.testPrice) return null;

	let price = `${program.price}`;
	if (config.dev || program.activeTestPrice) {
		price = `${program.testPrice}`;
	}

	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

const selectTemplate = item => {
	const { data: program } = item;
	// Check for override ENV variables
	if (config.passportsTemplateOverride) return config.passportsTemplateOverride;
	if (!program.templateId && !program.testTemplateId) return null;

	const templateId = config.dev ? program.testTemplateId : program.templateId;
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

const parseDescription = (program, description) => {
	if (!description) {
		return;
	}
	description = description.replace('{{visa-free}}', program.data.visaFree);
	description = description.replace('{{country}}', program.data.country);
	description = description.replace(/\n/g, '<br />');
	if (program.data.visaFreeRelevantCountries) {
		description = description.replace(
			'{{visa-free-relevant-countries}}',
			program.data.visaFreeRelevantCountries.join(',')
		);
	}
	return description;
};
const parseDescriptionArray = (program, descriptionArray) => {
	if (!descriptionArray) {
		return;
	}
	descriptionArray.forEach((text, index) => {
		text = text.replace('{{country}}', program.data.country);
		text = text.replace('{{visa-free}}', program.data.visaFree);
		if (program.data.visaFreeRelevantCountries) {
			text = text.replace(
				'{{visa-free-relevant-countries}}',
				program.data.visaFreeRelevantCountries.join(',')
			);
		}
		descriptionArray[index] = text;
	});
	return descriptionArray;
};
export const passportsSelectors = {
	selectPassports: (state, entityType) =>
		inventorySelectors
			.selectInventoryForCategory(state, 'passports', 'active', entityType)
			.map(program => {
				program.price = selectPrice(program);
				program.templateId = selectTemplate(program);
				program.walletAddress = selectVendorWalletAddress(program);
				program.didAddress = selectVendorDidAddress(program);
				program.data.description.investmentDescription = parseDescription(
					program,
					program.data.description.investmentDescription
				);
				program.data.description.requirements = parseDescription(
					program,
					program.data.description.requirements
				);
				program.data.description.procedures = parseDescription(
					program,
					program.data.description.procedures
				);
				program.data.description.taxes = parseDescription(
					program,
					program.data.description.taxes
				);
				program.data.benefitsCitizenship = parseDescriptionArray(
					program,
					program.data.benefitsCitizenship
				);

				// TODO: in the future should be provided by the API
				program.data.whatYouGet =
					'Requirements are subject to change at the discretion of the jurisdiction. There might be additional fees charged. Passport/Residency application is not guaranteed and is subject to the jurisdiction policies and rukes. A refund is not guaranteed if the account is not successfully opened.';

				return program;
			}),
	selectPassportsByFilter: (state, filter, entityType) =>
		passportsSelectors.selectPassports(state, entityType).find(filter)
};

export default passportsSelectors;
