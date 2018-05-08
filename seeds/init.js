const user = require('os').userInfo().username
const userDataPath = '/Users/' + user + '/Library/Application Support/Electron/'

const countriesList = require('../assets/data/country-list.json')
const idAttributeTypes = require('../assets/data/initial-id-attribute-type-list.json')
const ethTokens = require('../assets/data/eth-tokens.json')

const seeds = [
	{
		"table": "app_settings",
		"insert": [{
			dataFolderPath: userDataPath, 
			createdAt: new Date().getTime()
		}],
		"multi": false
	},
	{
		"table": "countries",
		"insert": countriesList,
		"multi": true
	},
	{
		"table": "guide_settings",
		"insert": [{
			guideShown: 0, 
			icoAdsShown: 0, 
			termsAccepted: 0, 
			createdAt: new Date().getTime()
		}],
		"multi": false
	},
	{
		"table": "id_attribute_types",
		"insert": idAttributeTypes,
		"multi": true
	},
	{
		"table": "tokens",
		"insert": ethTokens,
		"multi": true
	}
]

async function runSeeds(knex, seeds) {
	try {
		let allSeeds = []
		for (let seed of seeds) {
			const fullSeed = await knex(seed.table).del().then(() => {
				if (seed.multi) {
					let items = []
					for (let item of seed.insert) {
						item.createdAt = new Date().getTime()
						promises.push(knex(seed.table).insert(item))
					}
					return Promise.all(items)
				} else {
					return knex(seed.table).insert(seed.insert)
				}
			})
			allSeeds.push(fullSeed)
		}
		return Promise.all(allSeeds)
	} catch (e) {
		console.log(e)
	}
}

exports.seed = async function(knex) {
	return await runSeeds(knex, seeds)
}
