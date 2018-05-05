'use strict';

const ProviderEngine = requireNodeModule('web3-provider-engine');
const RpcSubprovider = requireNodeModule('web3-provider-engine/subproviders/rpc');


const LedgerWalletSubproviderFactory = requireNodeModule('ledger-wallet-provider').default;
const Eth = requireNodeModule('ethjs-query');
const HttpProvider = requireNodeModule('ethjs-provider-http');

function LedgerService($rootScope, $window, $q, $timeout, $log, CONFIG, RPCService) {
    'ngInject';


    //TODO create single object wich will be used from web3-services
    const SERVER_CONFIG = {
        mew: {
            1: { url: "https://api.myetherapi.com/eth" },
            3: { url: "https://api.myetherapi.com/rop" }
        },
        infura: {
            1: { url: "https://mainnet.infura.io" },
            3: { url: "https://ropsten.infura.io" }
        }
    };

    const getNetworkId = () => {
        return CONFIG.chainId;
    }


    const SELECTED_SERVER_URL = SERVER_CONFIG[CONFIG.node][CONFIG.chainId].url;

    const eth = new Eth(new HttpProvider(SELECTED_SERVER_URL));
    const engine = new ProviderEngine();
    const web3 = new Web3(engine);

    $log.info('LedgerService Initialized');

    class LedgerService {
        constructor() { }



        connect(derivationPath) {
            derivationPath = derivationPath || "44'/60'/0'/0";
            return new Promise((resolve, reject) => {

                LedgerWalletSubproviderFactory(getNetworkId, derivationPath)
                    .then((ledgerWalletSubProvider) => {
                        engine.addProvider(ledgerWalletSubProvider);

                        // TODO add is suportid or something like that
                        engine.addProvider(new RpcSubprovider({ rpcUrl: SELECTED_SERVER_URL }));
                        engine.start();
                        resolve();

                    }).catch((err) => {
                        reject();
                    });
            });
        }

        /* controller.prototype.getAccounts = () => {
           return web3.eth.getAccounts();
         }
       
         controller.prototype.signTransaction = (args) => {
           args.dataToSign.from = args.address;
           return web3.eth.signTransaction(args.dataToSign);
         }

         

       connect() {
           return RPCService.makeCall('connectToLedger');
       }

       getAccounts() {
           return RPCService.makeCall('getLedgerAccounts');
       }
*/
        createWalletByAddress(address) {
            return RPCService.makeCall('createLedgerWalletByAdress', { address });
        }

        signTransaction(dataToSign, address) {
            return RPCService.makeCall('signTransactionWithLedger', {
                dataToSign,
                address
            });
        }
    };

    return new LedgerService();
}

module.exports = LedgerService;




