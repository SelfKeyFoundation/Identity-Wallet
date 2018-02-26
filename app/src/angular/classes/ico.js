
'use strict';

class Ico {

    constructor(symbol, status, company, category) {

        this.symbol = symbol;               // symbol
        this.status = status;               // status - "In Progress", "Upcoming", "Finished"
        this.company = company;             // company
        this.category = category;           // category

        this.description = null;            // description
        this.shortDescription = null;       // short_description

        this.ethAddress = null;             // ethaddress
        this.whitepaper = null;             //
        this.website = null;                //

        this.whitelist = true;              //
        this.accepts = [];                  //

        this.startDate = null;              // start_date
        this.endDate = null;                // end_date
        this.daysLeft = null;               // [calculated]

        this.videos = {
            youtube: null,                  // youtube_video
            vimeo: null                     // vimeo_video
        }

        this.cap = {
            total: null,                    // hard_cap_USD
            raised: null                    // raised_USD
        }

        this.token = {
            price: null,                    // token_price
            total: null,                    // total_token_supply
            soldOnPresale: null,            // presale_sold_usd
            totalOnSale: null,              // tokens_available_for_sale
            issuance: null                  // token_issuance
        }

        this.restrictions = {
            minContribution: null,          // min_contribution_usd
            maxContribution: null,          // max_contribution_usd
            other: null                     // restrictions
        };

        this.kyc = {
            required: true,                 // kyc
            apiEndpoint: "",                // kyc
            template: "",                   // template id
            organisation: ""                // organisation id
        };
    }

    setInfo (description, shortDescription, ethAddress, whitepaper, website, whitelist, accepts) {
        this.description = description ? description : 'TBA';
        this.shortDescription = shortDescription ? shortDescription : 'TBA';
        this.ethAddress = ethAddress ? ethAddress : 'TBA';
        this.whitepaper = whitepaper;
        this.website = website;
        this.whitelist = whitelist;
        this.accepts = accepts;
    }

    setDate(startDate, endDate) {
        if(!startDate || !endDate) return;

        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.daysLeft = this.getDaysLeft();
    }

    setTokenInfo(price, total, soldOnPresale, totalOnSale, issuance) {
        this.token.price = price ? price : 'TBA';
        this.token.total = total ? total : 'TBA';
        this.token.soldOnPresale = soldOnPresale ? soldOnPresale : 'TBA';
        this.token.totalOnSale = totalOnSale ? totalOnSale : 'TBA';
        this.token.issuance = issuance ? issuance : 'TBA';
    }

    setCap(total, raised) {
        this.cap.total = total;
        this.cap.raised = raised;
    }

    setRestrictions(minContribution, maxContribution, other) {
        this.restrictions.minContribution = minContribution ? minContribution : 'TBA';
        this.restrictions.maxContribution = maxContribution ? maxContribution : 'TBA';
        this.restrictions.other = other ? other : 'TBA';
    }

    setKyc (apiEndpoint, required, template, organisation) {
        this.kyc.required = required && required === 'YES' ? true : false;
        this.kyc.apiEndpoint = apiEndpoint;
        this.kyc.template = template;
        this.kyc.organisation = organisation;
    }

    setVideos(youtube, vimeo) {
        this.videos.youtube = youtube;
        this.videos.vimeo = vimeo;
    }

    getDaysLeft() {
        if(!this.endDate) { return '' }
        let millis = this.endDate.getTime() - new Date().getTime();
        let days = millis / (1000 * 60 * 60 * 24);
        if (days > 0) {
            return Math.round((days));
        } else {
            return -1;
        }
    }

    getCapProgressPercent () {
        return Math.round(this.cap.raised / this.cap.total * 100);
    }
}

//module.exports = Ico;
