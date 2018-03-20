'use strict';

const electron = require('electron');
const config = require('../config');
const request = require('request');

module.exports = function (app) {

    // TODO - take this from config
    const AIRTABLE_API = config.airtableBaseUrl;

    const controller = function () { };

    controller.prototype.loadIdAttributeTypes = () => {
        const ID_ATTRIBUTE_TABLE = "id-attributes"
        request.get(AIRTABLE_API + ID_ATTRIBUTE_TABLE, (error, httpResponse, result) => {
            let idAttributesArray = JSON.parse(result).ID_Attributes;
            for (let i in idAttributesArray) {
                if (!idAttributesArray[i].data) continue;

                let item = idAttributesArray[i].data.fields;

                electron.app.sqlLiteService.IdAttributeType.create(item).then((idAttributeType) => {
                    // inserted
                }).catch((error) => {
                    // error
                });
            }
        });
    }

    controller.prototype.loadExchangeData = () => {
        const TABLE = 'Exchanges';
        request.get(AIRTABLE_API + TABLE, (error, httpResponse, result) => {
            const data = JSON.parse(result).Exchanges;
            for (let i in data) {
                if (!data[i].data) {
                    continue;
                }
                const item = data[i].data.fields;
                const dataToSave = {
                    name: item.name,
                    code: item.Code,
                    title: item.title,
                    wallet: item.Wallet,
                    company: item.Company,
                    email: item['email 2'],
                    keyPerson: item['key person'],
                    description: item.description,
                    acceptsFiat: item['Accepts Fiat'],
                    buySellFee: item['Buy/Sell Fee'],
                    yearLaunched: item['year_launched'],
                    personalAccount: item['Personal Account'],
                    creditDebitDepositFee: item['credit_debit_deposit_fee'],
                    twoFactorAuthentication: item['Two-factor-authentication'],
                    bankTransferDepositFee: item['bank_transfer_deposit_fee'],
                    bankTransferWithdrawalFee: item['bank_transfer_withdrawal_fee'],
                    type: (item['Type'] || []).join(';'),
                    goodFor: (item['Good for'] || []).join(';'),
                    languages: (item['Languages'] || []).join(';'),
                    headquarters: (item['headquarters'] || []).join(';'),
                    regulatedBy: (item['regulated_by'] || []).join(';'),
                    fiatPayments: (item['fiat_payments'] || []).join(';'),
                    currencyPairs: (item['Currency Pairs'] || []).join(';'),
                    fiatSupported: (item['fiat_supported'] || []).join(';'),
                    kycIndividuals: (item['KYC Individuals'] || []).join(';'),
                    osAvailability: (item['OS availability'] || []).join(';'),
                    cryptoSupported: (item['cryptos_supported'] || []).join(';'),
                    deviceAvailability: (item['Device availability'] || []).join(';'),
                    countriesSupported: (item['countries_supported'] || []).join(';'),
                    fiatWithdrawalMethods: (item['Fiat Withdrawal methods'] || []).join(';'),
                    logoUrl: item.logo ? item.logo.url : ''
                }
                electron.app.sqlLiteService.ExchangeDataHandler.create(item).then((dataToSave) => {
                    // inserted
                }).catch((error) => {
                    console.log("!!!!!!!!!!!!!", error)
                    // error
                });
            }
        });
    }

    return controller;
};
