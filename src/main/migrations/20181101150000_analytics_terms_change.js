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
	await resetTerms(knex, Promise);
};

exports.down = async (knex, Promise) => {
	await resetTerms(knex, Promise);
};
