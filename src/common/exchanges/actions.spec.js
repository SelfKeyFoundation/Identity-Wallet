import * as actions from './actions';
import * as types from './types';

describe('actions', () => {
	it('should create an action to update Exchanges', () => {
		const exchanges = [
			{
				name: 'Gatecoin',
				data: {
					URL: 'http://www.gatecoin.com',
					Code: 'UK1e',
					Type: [Array],
					logo: [Array],
					name: 'Gatecoin',
					email: 'support@gatecoin.com',
					title: 'Co-founder & CEO',
					Wallet: true,
					status: 'Active',
					Company: 'Coinbase UK, Ltd, Coinbase Inc',
					'KYC/AML': 'Yes',
					'email 2': 'brian@coinbase.com',
					'Good for': [Array],
					location: [Array],
					Languages: [Array],
					maker_fee: '0.25%',
					taker_fee: '0.35%',
					coin_pairs: '72',
					'key person': 'Brian Armstrong',
					description:
						'Founded in 2013 by investment bankers, Gatecoin is a bitcoin and ethereum token exchange designed for both professional traders and retail investors. Through our intuitive trading platform, we enable individuals and institutions around the world to trade and invest in a wide variety of cryptocurrencies and blockchain assets. \n\nGatecoin has been an early supporter of bitcoininspired technologies, as the first exchange in the world to list ethereum’s token, ether (ETH) in August 2015. We were subsequently the first exchange to list ERC20 standard tokens associated with decentralized applications (dapps) built on top of ethereum and the first to provide direct participation in token generation events (TGEs) or initial coin offerings (ICOs). \n\nAs cryptocurrencies and blockchain tokens challenge and transform forex and capital markets, Gatecoin is the marketplace bridging the two domains. We are the NASDAQ for the blockchain era.',
					exchange_id: 1,
					integration: 'Coming Soon',
					'Accepts Fiat': true,
					'Buy/Sell Fee': '1.49%',
					kyc_template: [Array],
					fiat_payments: [Array],
					year_launched: 2013,
					'Currency Pairs': [Array],
					fiat_supported: [Array],
					margin_trading: 'No',
					'KYC Individuals': [Array],
					'OS availability': [Array],
					'Personal Account': true,
					excluded_residents: [Array],
					'Device availability': [Array],
					'Fiat Withdrawal methods': [Array],
					'Two-factor-authentication': true
				},
				createdAt: 1536761705179,
				updatedAt: 1536761865637
			}
		];

		const expectedAction = {
			type: types.EXCHANGES_UPDATE,
			payload: exchanges
		};
		expect(actions.updateExchanges(exchanges)).toEqual(expectedAction);
	});
});
