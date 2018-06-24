'use strict';

const electron = require('electron');
const config = require('../config');
const request = require('request');

module.exports = function(app) {
	const AIRTABLE_API = config.airtableBaseUrl;

	const controller = function() {};

	controller.prototype.loadIdAttributeTypes = () => {
		const ID_ATTRIBUTE_TABLE = 'id-attributes';
		request.get(AIRTABLE_API + ID_ATTRIBUTE_TABLE, (error, httpResponse, result) => {
			let idAttributesArray = JSON.parse(result).ID_Attributes;
			for (let i in idAttributesArray) {
				if (!idAttributesArray[i].data) continue;

				let item = idAttributesArray[i].data.fields;

				electron.app.sqlLiteService.IdAttributeType.create(item)
					.then(idAttributeType => {
						// inserted
					})
					.catch(error => {
						// error
					});
			}
		});
	};

	controller.prototype.loadExchangeData = () => {
		const TABLE = 'Exchanges';
		request.get(AIRTABLE_API + TABLE, (error, httpResponse, result) => {
			const data = JSON.parse(result).Exchanges;
			for (let i in data) {
				if (!data[i].data) {
					continue;
				}
				const item = data[i].data.fields;
				if (!item.name) {
					continue;
				}
				const dataToSave = {
					name: item.name,
					data: JSON.stringify(item)
				};

				electron.app.sqlLiteService.ExchangeDataHandler.create(dataToSave)
					.then(data => {
						// inserted
					})
					.catch(error => {
						console.log('!!!!!!!!!!!!!', error);
						// error
					});
			}
		});
	};

	return controller;
};
