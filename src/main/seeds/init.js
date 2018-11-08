/* istanbul ignore file */
const { getUserDataPath } = require('../../common/utils/common');
const userDataPath = getUserDataPath();
const countriesList = require('../assets/data/country-list.json');
const ethTokens = require('../assets/data/eth-tokens.json');

const seeds = () => [
	{
		table: 'seed',
		insert: [
			{
				name: 'init'
			}
		]
	},
	{
		table: 'app_settings',
		insert: [
			{
				dataFolderPath: userDataPath,
				createdAt: Date.now()
			}
		],
		multi: false
	},
	{
		table: 'countries',
		insert: countriesList,
		multi: true
	},
	{
		table: 'guide_settings',
		insert: [
			{
				guideShown: 0,
				icoAdsShown: 0,
				termsAccepted: 0,
				createdAt: Date.now()
			}
		],
		multi: false
	},
	{
		table: 'tokens',
		insert: ethTokens,
		multi: true
	}
];

async function runSeeds(knex, seeds) {
	const seedHasRun = await knex('seed')
		.where('name', 'init')
		.count('name as countName');

	if (seedHasRun[0].countName > 0) {
		return;
	}

	try {
		// want to remove promise wrapper
		let allSeeds = [];
		for (let seed of seeds) {
			// check this when to delete or not delete seed data
			const fullSeed = await knex(seed.table)
				.del()
				.then(() => {
					// leave this explicit setting rather than check array length please
					if (seed.multi) {
						// want to remove promise wrapper
						let items = [];
						for (let item of seed.insert) {
							let insertItem = {
								...item,
								createdAt: Date.now()
							};
							// any way to remove this dirty hack please
							if (item.entity) {
								insertItem.entity = JSON.stringify(item.entity);
							}
							// table.timestamps() on schema fixes this issue

							items.push(knex(seed.table).insert(insertItem));
						}
						return Promise.all(items);
					} else {
						return knex(seed.table).insert(seed.insert);
					}
				});
			allSeeds.push(fullSeed);
		}
		return Promise.all(allSeeds);
	} catch (e) {
		console.error(e);
	}
}

exports.seed = async function(knex) {
	return runSeeds(knex, seeds());
};
