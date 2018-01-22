'use strict';

import EthUtils from '../classes/eth-utils';
import IdAttributeType from '../classes/id-attribute-type';
import Ico from '../classes/ico';

function SelfkeyService($rootScope, $window, $q, $timeout, $log, $http, ConfigFileService) {
  'ngInject';

  $log.info('SelfkeyService Initialized');

  /**
   * 
   */
  const BASE_URL = 'https://alpha.selfkey.org/marketplace/i/api/';
  //const KYC_BASE_URL = 'https://wallet-demo-api-test.selfkey.org/';
  const KYC_BASE_URL = 'https://token-sale-demo-api.kyc-chain.com/';



  /**
   * 
   */
  let CACHE = window.sessionStorage;

  /**
   * 
   */
  const PRICES = {};

  /**
   * 
   */
  class SelfkeyService {

    constructor() {
      this.loadData(true);
    }

    retrieveTableData(table, reload) {
      let defer = $q.defer();

      // temporary
      reload = true;

      const cache_data = CACHE.getItem(table);
      if (reload || !cache_data) {
        const apiURL = BASE_URL + table;
        let promise = $http.get(apiURL, { headers: { 'Cache-Control': 'no-cache' } });
        promise.then((response) => {
          CACHE.setItem(table, JSON.stringify(response.data));
          defer.resolve(response.data);
        }).catch((error) => {
          // TODO
          defer.reject(error);
        });
      } else {
        defer.resolve(JSON.parse(cache_data));
      }

      return defer.promise;
    }

    dispatchIdAttributeTypes(reload) {
      let defer = $q.defer();

      let idAttributeTypes = {};
      let promise = this.retrieveTableData('id-attributes', reload);
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

    dispatchIcos(reload) {
      let defer = $q.defer();

      let icos = [];
      let promise = this.retrieveTableData('icos', reload);
      promise.then((data) => {
        let icoDetailsArray = data.ICO_Details;
        console.log("ICO_Details", data.ICO_Details);

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
          ico.setKyc(item.kyc_api_endpoint, item.kyc, item.template, item.organisation);
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

    retrieveKycTemplate(kycBaseUrl, organizationId, templateId) {
      let defer = $q.defer();

      let promise = $http.get(kycBaseUrl + "/organization/" + organizationId + "/template/marketplace/" + templateId);
      promise.then((resp) => {
        defer.resolve(resp.data);
      }).catch((error) => {
        defer.reject(error);
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
        $http.post(KYC_BASE_URL + "organization/" + organizationId + "/register", {
          "ethAddress": ethAddress,
          "email": email
        }).finally(() => {
          $http.get(KYC_BASE_URL + "walletauth?ethAddress=" + "0x" + ethAddress).then((resp) => {

            if (Web3Service.constructor.web3.utils.isHex(resp.data.challenge)) {
              defer.reject("danger_challenge_provided");
            } else {
              let reqBody = EthUtils.signChallenge(resp.data.challenge, privateKeyHex);
              $http.post(KYC_BASE_URL + "walletauth", reqBody).then((resp) => {
                wallet.sessionsStore[organizationId] = resp.data.token;
                ConfigFileService.save().then(() => {
                  defer.resolve(resp.data.token);
                }).catch((error) => {
                  defer.reject(error)
                })
              }).catch((error) => {
                defer.reject(error)
              })
            }
          }).catch((error) => {
            defer.reject(error)
          });
        });
      }

      return defer.promise;
    }

    authWithKYC(privateKeyHex, ethAddress, organizationId) {
      let defer = $q.defer();

      let store = ConfigFileService.getStore();
      let wallet = store.wallets[$rootScope.wallet.getPublicKeyHex()];

      if(!wallet.sessionsStore) {
        wallet.sessionsStore = {};
      }

      if (wallet && wallet.sessionsStore && wallet.sessionsStore[organizationId]) {
        defer.resolve(wallet.sessionsStore[organizationId]);
      } else {
        
        $http.get(KYC_BASE_URL + "walletauth?ethAddress=" + "0x" + ethAddress).then((resp) => {
          if (Web3Service.constructor.web3.utils.isHex(resp.data.challenge)) {
            defer.reject("danger_challenge_provided");
          } else {
            let reqBody = EthUtils.signChallenge(resp.data.challenge, privateKeyHex);
            $http.post(KYC_BASE_URL + "walletauth", reqBody).then((resp) => {
              wallet.sessionsStore[organizationId] = resp.data.token;
              ConfigFileService.save().then(() => {
                defer.resolve(resp.data.token);
              }).catch((error) => {
                defer.reject(error)
              })
            }).catch((error) => {
              defer.reject(error)
            })
          }
        }).catch((error) => {
          defer.reject(error)
        });

      }

      return defer.promise;
    }

    initKycProcess(privateKeyHex, templateId, organizationId, ethAddress, email) {
    }

    getPrices(tokens) {
      let defer = $q.defer();

      // ["KEY", "ETH"]
      let promise = $http.post("https://token-sale-demo-api.kyc-chain.com/rate/tokens/symbol", { "tokens": tokens });
      
      promise.then((resp)=>{
        for(let i in resp.data.items){
          let item = resp.data.items[i];
          if(item){
            PRICES[item.symbol] = item;
          }
        }
        $rootScope.PRICES = PRICES;
        defer.resolve($rootScope.PRICES);
      }).catch((error)=>{
        defer.reject("CANT_GET_PRICE");
      });

      return defer.promise;
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