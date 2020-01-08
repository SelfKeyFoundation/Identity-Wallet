/* istanbul ignore file */

const resetTerms = async (knex, Promise) => {
	await knex('guide_settings').update({
		guideShown: 0,
		icoAdsShown: 0,
		termsAccepted: 0,
		crashReportAgreement: 0,
		updatedAt: new Date().getTime()
	});
};

exports.up = async (knex, Promise) => {
	try {
		await resetTerms(knex, Promise);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await resetTerms(knex, Promise);
};
