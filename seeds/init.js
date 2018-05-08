const user = require('os').userInfo().username
const userDataPath = '/Users/' + user + '/Library/Application Support/Electron/'
const countriesList = require('../assets/data/country-list.json')
const idAttributeTypes = require('../assets/data/initial-id-attribute-type-list.json')
const ethTokens = require('../assets/data/eth-tokens.json')

// app_settings
function seedAppSettings(knex) {
	return knex('app_settings').del().then(() => {
		return knex('app_settings').insert([{
			dataFolderPath: userDataPath, 
			createdAt: new Date().getTime()
		}])
	})
}

// countries
function seedCountries(knex) {
	return knex('countries').del().then(() => {
		let promises = []
		for (let item of countriesList) {
			item.createdAt = new Date().getTime()
			promises.push(knex('countries').insert(item))
		}
		return Promise.all(promises)
	})
}

// guide_settings
function seedGuideSettings(knex) {
	return knex('guide_settings').del().then(() => {
		return knex('guide_settings').insert([{ 
			guideShown: 0, 
			icoAdsShown: 0, 
			termsAccepted: 0, 
			createdAt: new Date().getTime() 
		}])
	})
}

// id_attribute_types
function seedIdAttributeTypes(knex) {
	return knex('id_attribute_types').del().then(() => {
		let promises = []
		for (let item of idAttributeTypes) {
	        promises.push(knex('id_attribute_types').insert({ 
	        	key: item.key, 
	        	category: item.category, 
	        	type: item.type, 
	        	entity: JSON.stringify(item.entity), 
	        	isInitial: 1, 
	        	createdAt: new Date().getTime()
	        }))
	    }
		return Promise.all(promises)
	})
}

// tokens
function seedTokens(knex) {
	return knex('tokens').del().then(() => {
		let promises = []
		for (let item of ethTokens) {
			promises.push(knex('tokens').insert({ 
				address: item.address, 
				symbol: item.symbol, 
				decimal: item.decimal,
				createdAt: new Date().getTime()
			}))
		}
		return Promise.all(promises)
	})
}

exports.seed = function(knex, Promise) {
	return Promise.all([
		seedAppSettings(knex),
		seedCountries(knex),
		seedGuideSettings(knex),
		seedIdAttributeTypes(knex),
		seedTokens(knex)
	])
}
