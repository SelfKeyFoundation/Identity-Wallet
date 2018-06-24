const user = require('os').userInfo().username;
const electron = require('electron');
const userDataPath = electron.app.getPath('userData');
const countriesList = require('../assets/data/country-list.json');
const idAttributeTypes = require('../assets/data/initial-id-attribute-type-list.json');
const ethTokens = require('../assets/data/eth-tokens.json');

const seeds = [
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
				createdAt: new Date().getTime()
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
				createdAt: new Date().getTime()
			}
		],
		multi: false
	},
	{
		table: 'id_attribute_types',
		insert: idAttributeTypes,
		multi: true
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
							// any way to remove this dirty hack please
							if (item.entity) {
								item.entity = JSON.stringify(item.entity);
							}
							// table.timestamps() on schema fixes this issue
							item.createdAt = new Date().getTime();
							items.push(knex(seed.table).insert(item));
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
	return await runSeeds(knex, seeds);
};
