
'use strict';

class Ico {

    id = null;      // symbol

    status = "active";  // active, upcoming, ended

    ticker = null;

    companyName = null;
    category = null;
    description = null;
    shortDescription = null;
    teamLoaction = null;

    video = null;
    whitepaper = null;
    website = null;

    startDate = null;
    endDate = null;
    daysLeft = null;

    personalCap = null;
    whitelist = true;
    accepts = [];
    restrictions = null;

    capital = {
        total: null,
        raised: null,
        goal: null
    }

    token = {
        total: null,
        totalForSale: null,
        price: null,
        issue: null
    }

    preSale = {
        sold: null,
        bonus: null
    }

    kyc = {
        required: true,
        template: "apiEndpoint"
    };
    
    contractInfo = {
        address: null,
        symbol: null,
        decimal: null,
        type: null,
    }

    constructor () {

    }

}