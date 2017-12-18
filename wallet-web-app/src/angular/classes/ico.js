
'use strict';

class Ico {

    constructor() {
        this.id = null;             // symbol
        this.status = "active";     // active, upcoming, ended

        this.ticker = null;

        this.companyName = null;
        this.category = null;
        this.description = null;
        this.shortDescription = null;
        this.teamLoaction = null;

        this.ethAddress = null;

        this.video = null;
        this.whitepaper = null;
        this.website = null;

        this.startDate = null;
        this.endDate = null;
        this.daysLeft = null;

        this.personalCap = null;
        this.whitelist = true;
        this.accepts = [];

        this.restrictions = {
            minContribution: null,
            maxContribution: null,
            other: null
        };

        this.capital = {
            total: null,
            raised: null,
            goal: null
        }

        this.token = {
            total: null,
            totalForSale: null,
            price: null,
            issue: null
        }

        this.preSale = {
            sold: null,
            bonus: null
        }

        this.kyc = {
            required: true,
            template: "apiEndpoint",
            requirements: ['Name', 'Email', 'Telephone Number', 'Passport', 'National ID Card', 'Utility Bill']
        };

        this.contractInfo = {
            address: null,
            symbol: null,
            decimal: null,
            type: null,
        }
    }

    getDaysLeft() {
        let millis = this.endDate().getTime() - new Date().getTime();
        let days = millis / (1000 * 60 * 60 * 24);
        if (days > 0) {
            return Math.round((days));
        } else {
            return 0;
        }
    }

}

export default Ico;