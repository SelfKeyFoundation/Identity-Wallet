'use strict';

import IdAttributeType from '../classes/id-attribute-type.js';
import Ico from '../classes/ico.js';

function SelfkeyService($rootScope, $window, $q, $timeout, $log, $http, ConfigFileService) {
  'ngInject';

  $log.info('SelfkeyService Initialized');

  /**
   * 
   */
  const BASE_URL = 'https://alpha.selfkey.org/marketplace/i/api/';
  const KYC_BASE_URL = 'http://192.168.157.21:8080/';

  /**
   * 
   */
  let CACHE = window.sessionStorage;

  /**
   * 
   */
  class SelfkeyService {

    constructor() {
      this.loadData();
    }

    retrieveTableData(table, reload) {
      let defer = $q.defer();

      const cache_data = CACHE.getItem(table);
      if (cache_data && !reload) {
        defer.resolve(JSON.parse(cache_data));
      } else {
        const apiURL = BASE_URL + table;
        let promise = $http.get(apiURL);
        promise.then((response) => {
          CACHE.setItem(table, JSON.stringify(response.data));
          defer.resolve(response.data);
        }).catch((error) => {
          // TODO
          defer.reject(error);
        });
      }
      return defer.promise;
    }

    dispatchIdAttributeTypes() {
      let defer = $q.defer();

      let idAttributeTypes = {};
      let promise = this.retrieveTableData('id-attributes');
      promise.then((data) => {
        let idAttributesArray = data.ID_Attributes;

        for (let i in idAttributesArray) {
          let item = idAttributesArray[i].data.fields;
          idAttributeTypes[item.key] = new IdAttributeType(
            item.key,
            item.category,
            item.type,
            item.entity
          );
        }

        defer.resolve(idAttributeTypes);
      });

      return defer.promise;
    }

    dispatchIcos() {
      let defer = $q.defer();

      let icos = [];
      let promise = this.retrieveTableData('icos');
      promise.then((data) => {
        let icoDetailsArray = data.ICO_Details;
        console.log(">>>>>>", data.ICO_Details);

        for (let i in icoDetailsArray) {
          let item = icoDetailsArray[i].data.fields;
          if (!item.symbol) continue;

          let ico = new Ico(
            item.symbol,
            item.status,
            item.company,
            item.category
          );

          ico.setDate(item.start_date, item.end_date);

          ico.setTokenInfo(
            item.token_price,
            item.total_token_supply,
            item.presale_sold_usd,
            item.tokens_available_for_sale,
            item.token_issuance
          );

          ico.setCap(item.hard_cap_USD, item.raised_USD);
          ico.setRestrictions(item.min_contribution_usd, item.max_contribution_usd, item.restrictions);
          ico.setKyc(item.kyc, item.kycc_template);
          ico.setVideos(item.youtube_video, null);

          ico.setInfo(
            item.description,
            item.short_description,
            item.ethaddress,
            item.whitepaper,
            item.website,
            item.whitelist,
            item.accepts
          );

          icos.push(ico);
        }

        defer.resolve(icos);
      });

      return defer.promise;
    }

    retrieveKycSessionToken(privateKeyHex, ethAddress, email, organizationId) {
      let defer = $q.defer();

      let store = ConfigFileService.getStore();
      let wallet = store.wallets[$rootScope.wallet.getPublicKeyHex()];
      if (wallet && wallet.sessionsStore && wallet.sessionsStore[organizationId]) {
        defer.resolve(wallet.sessionsStore[organizationId]);
      } else {
        $http.post(KYC_BASE_URL + "organization/5a3e6c01d6dab14395fa711d/register", {
          "ethAddress": ethAddress,
          "email": email
        }).finally(() => {
          $http.get(KYC_BASE_URL + "walletauth?ethAddress=" + ethAddress).then((resp) => {
            let reqBody = EthUtils.signChallenge(resp.data.challenge, privateKeyHex);
            $http.post(KYC_BASE_URL + "walletauth", reqBody).then((resp) => {
              wallet.sessionsStore[organizationId] = resp.data.token;
              ConfigFileService.save().then(() => {
                defer.resolve(resp.data.token);
              }).catch((error) => {
                defer.reject()
              })
            }).catch((error) => {
              defer.reject()
            })
          }).catch((error) => {
            defer.reject()
          });
        });
      }

      return defer.promise;
    }

    initKycProcess(privateKeyHex, templateId, organizationId, ethAddress, email) {

    }

    loadData(reload) {
      // 1: Load Id Attribute Types
      this.dispatchIdAttributeTypes(reload).then((data) => {
        ConfigFileService.setIdAttributeTypes(data);
      });

      // 2: Load ICOs
      this.dispatchIcos(reload).then((data) => {
        for (let i in data) {
          ConfigFileService.addIco(data[i].status, data[i]);
        }
      });

      $rootScope.icos = ConfigFileService.getIcos();
    }
  };

  return new SelfkeyService();
}

export default SelfkeyService;