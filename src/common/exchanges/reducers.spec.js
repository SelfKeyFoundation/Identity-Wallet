import reducer, { initialState } from './reducers';
import * as types from './types';

describe('exchanges reducer', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

	it('should handle EXCHANGES_UPDATE', () => {
		const exchanges = [
			{
				name: 'Gatecoin',
				data: {
					logo: [Array],
					title: 'Co-founder & CEO',
					location: [Array],
					'Good for': [Array],
					fiat_payments: [Array],
					taker_fee: '0.35%',
					Wallet: true,
					'key person': 'Brian Armstrong',
					URL: 'https://www.gatecoin.com',
					exchange_id: 1,
					'email 2': 'brian@coinbase.com',
					status: 'Active',
					fiat_supported: [Array],
					'KYC/AML': 'Yes',
					'Currency Pairs': [Array],
					email: 'support@gatecoin.com',
					'OS availability': [Array],
					'KYC Individuals': [Array],
					coin_pairs: '72',
					'Two-factor-authentication': true,
					maker_fee: '0.25%',
					margin_trading: 'No',
					description:
						'Founded in 2013 by investment bankers, Gatecoin is a bitcoin and ethereum token exchange designed for both professional traders and retail investors. Through our intuitive trading platform, we enable individuals and institutions around the world to trade and invest in a wide variety of cryptocurrencies and blockchain assets. \n\nGatecoin has been an early supporter of bitcoin inspired technologies, as the first exchange in the world to list ethereum’s token, ether (ETH) in August 2015. We were subsequently the first exchange to list ERC20 standard tokens associated with decentralized applications (dapps) built on top of ethereum and the first to provide direct participation in token generation events (TGEs) or initial coin offerings (ICOs). \n\nAs cryptocurrencies and blockchain tokens challenge and transform forex and capital markets, Gatecoin is the marketplace bridging the two domains. We are the NASDAQ for the blockchain era.',
					Code: 'UK1e',
					'Buy/Sell Fee': '1.49%',
					year_launched: 2013,
					integration: 'Coming Soon',
					Type: [Array],
					name: 'Gatecoin',
					'Device availability': [Array],
					Company: 'Coinbase UK, Ltd, Coinbase Inc',
					requiredBalance: 25,
					'Accepts Fiat': true,
					'Personal Account': true,
					Languages: [Array],
					excluded_residents: [Array],
					kyc_template: [Array],
					'Fiat Withdrawal methods': [Array]
				},
				createdAt: 1536761705179,
				updatedAt: 1536761865637
			}
		];

		expect(
			reducer(
				{},
				{
					type: types.EXCHANGES_UPDATE,
					payload: exchanges
				}
			)
		).toEqual({
			byId: {
				Gatecoin: {
					name: 'Gatecoin',
					data: {
						logo: [Array],
						title: 'Co-founder & CEO',
						location: [Array],
						'Good for': [Array],
						fiat_payments: [Array],
						taker_fee: '0.35%',
						Wallet: true,
						'key person': 'Brian Armstrong',
						URL: 'https://www.gatecoin.com',
						exchange_id: 1,
						'email 2': 'brian@coinbase.com',
						status: 'Active',
						fiat_supported: [Array],
						'KYC/AML': 'Yes',
						'Currency Pairs': [Array],
						email: 'support@gatecoin.com',
						'OS availability': [Array],
						'KYC Individuals': [Array],
						coin_pairs: '72',
						'Two-factor-authentication': true,
						maker_fee: '0.25%',
						margin_trading: 'No',
						description:
							'Founded in 2013 by investment bankers, Gatecoin is a bitcoin and ethereum token exchange designed for both professional traders and retail investors. Through our intuitive trading platform, we enable individuals and institutions around the world to trade and invest in a wide variety of cryptocurrencies and blockchain assets. \n\nGatecoin has been an early supporter of bitcoin inspired technologies, as the first exchange in the world to list ethereum’s token, ether (ETH) in August 2015. We were subsequently the first exchange to list ERC20 standard tokens associated with decentralized applications (dapps) built on top of ethereum and the first to provide direct participation in token generation events (TGEs) or initial coin offerings (ICOs). \n\nAs cryptocurrencies and blockchain tokens challenge and transform forex and capital markets, Gatecoin is the marketplace bridging the two domains. We are the NASDAQ for the blockchain era.',
						Code: 'UK1e',
						'Buy/Sell Fee': '1.49%',
						year_launched: 2013,
						integration: 'Coming Soon',
						Type: [Array],
						name: 'Gatecoin',
						'Device availability': [Array],
						Company: 'Coinbase UK, Ltd, Coinbase Inc',
						requiredBalance: 25,
						'Accepts Fiat': true,
						'Personal Account': true,
						Languages: [Array],
						excluded_residents: [Array],
						kyc_template: [Array],
						'Fiat Withdrawal methods': [Array]
					},
					createdAt: 1536761705179,
					updatedAt: 1536761865637
				}
			},
			allIds: ['Gatecoin']
		});
	});
});
