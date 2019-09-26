import { getExchanges, getServiceDetails, getExchangeLinks, hasBalance } from './selectors';

describe('selectors', () => {
	const exchanges = {
		byId: {
			Gatecoin: {
				name: 'Gatecoin',
				data: {
					logo: [{ url: 'https://logo.jpg' }],
					title: 'Co-founder & CEO',
					location: [],
					'Good for': [Array],
					fiat_payments: [],
					taker_fee: '0.35%',
					Wallet: true,
					'key person': 'Brian Armstrong',
					URL: 'https://www.gatecoin.com',
					exchange_id: 1,
					'email 2': 'brian@coinbase.com',
					status: 'Active',
					fiat_supported: [],
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
					excluded_residents: [],
					relying_party_config: {
						templates: ['test']
					},
					'Fiat Withdrawal methods': [Array]
				},
				createdAt: 1536761705179,
				updatedAt: 1536761865637
			}
		},
		allIds: ['Gatecoin']
	};

	const prices = {
		prices: [
			{
				id: 1,
				name: 'Selfkey',
				priceBTC: 1,
				priceETH: 31.288316997525087,
				priceUSD: 6513.00400614,
				source: 'https://coincap.io',
				symbol: 'KEY'
			},
			{
				id: 1,
				name: 'Selfkey',
				priceBTC: 1,
				priceETH: 31.288316997525087,
				priceUSD: 6513.00400614,
				source: 'https://coincap.io',
				symbol: 'KI'
			},
			{
				id: 1,
				name: 'Ethereum',
				priceBTC: 1,
				priceETH: 31.288316997525087,
				priceUSD: 6513.00400614,
				source: 'https://coincap.io',
				symbol: 'ETH'
			}
		]
	};

	const wallet = {
		balance: '0.06863928',
		balanceInFiat: 14.436213369599999,
		hidden: 0,
		id: 1,
		isSetupFinished: 0,
		keystoreFilePath:
			'4184288c556524df9cb9e58b73265ee66dca4efe/UTC--2018-05-21T16:59:11.393Z--4184288c556524df9cb9e58b73265ee66dca4efe',
		name: 'Ethereum',
		price: 210.32,
		privateKey: 'fdsfdsfdsfds4231321dasdf21ed3',
		profile: 'local',
		address: '4184288c556524df9cb9e58b73265ee66dca4efe',
		symbol: 'ETH'
	};

	const walletTokens = {
		tokens: [
			{
				address: '0x4cc19356f2d37338b9802aa8e8fc58b0373296e7',
				balance: '30',
				balanceInFiat: 0.01068399626228,
				createdAt: 1536856439488,
				decimal: 18,
				hidden: 0,
				id: 1,
				isCustom: 0,
				name: 'Selfkey',
				price: 0.00534199813114,
				priceUSD: 0.00534199813114,
				recordState: 1,
				symbol: 'KEY',
				tokenId: 1,
				updatedAt: 1536856439488,
				walletId: 1
			},
			{
				address: '0x4cc19356f2d37338b9802aa8e8fc58b0373296e7',
				balance: '30',
				balanceInFiat: 0.01068399626228,
				createdAt: 1536856439488,
				decimal: 18,
				hidden: 0,
				id: 1,
				isCustom: 0,
				name: 'Selfkey',
				price: 0.00534199813114,
				priceUSD: 0.00534199813114,
				recordState: 1,
				symbol: 'KI',
				tokenId: 1,
				updatedAt: 1536856439488,
				walletId: 1
			}
		]
	};

	it('should return exchanges', () => {
		const expectedExchanges = [
			{
				name: 'Gatecoin',
				status: 'Active',
				description:
					'Founded in 2013 by investment bankers, Gatecoin is a bitcoin and ethereum token exchange designed for both professional traders and retail investors. Through our intuitive trading platform, we enable individuals and institutions around the world to trade and invest in a wide variety of cryptocurrencies and blockchain assets. \n\nGatecoin has been an early supporter of bitcoin inspired technologies, as the first exchange in the world to list ethereum’s token, ether (ETH) in August 2015. We were subsequently the first exchange to list ERC20 standard tokens associated with decentralized applications (dapps) built on top of ethereum and the first to provide direct participation in token generation events (TGEs) or initial coin offerings (ICOs). \n\nAs cryptocurrencies and blockchain tokens challenge and transform forex and capital markets, Gatecoin is the marketplace bridging the two domains. We are the NASDAQ for the blockchain era.',
				logoUrl: 'https://logo.jpg',
				serviceOwner: '0x0000000000000000000000000000000000000000',
				serviceId: 'global',
				amount: 25,
				lockPeriod: 2592000000,
				excludedResidents: [],
				fees: '0.25%',
				fiatPayments: [],
				fiatSupported: [],
				location: []
			}
		];
		expect(getExchanges({ exchanges })).toEqual(expectedExchanges);
	});

	it('should return exchange links', () => {
		const expectedExchangeLinks = [
			{
				name: 'Gatecoin',
				url: 'https://www.gatecoin.com'
			}
		];
		expect(getExchangeLinks({ exchanges })).toEqual(expectedExchangeLinks);
	});

	it('should return exchange details', () => {
		const expectedExchangeDetails = {
			logo: [{ url: 'https://logo.jpg' }],
			title: 'Co-founder & CEO',
			location: [],
			'Good for': [Array],
			fiat_payments: [],
			taker_fee: '0.35%',
			Wallet: true,
			'key person': 'Brian Armstrong',
			URL: 'https://www.gatecoin.com',
			exchange_id: 1,
			'email 2': 'brian@coinbase.com',
			status: 'Active',
			fiat_supported: [],
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
			lockPeriod: 2592000000,
			serviceId: 'global',
			serviceOwner: '0x0000000000000000000000000000000000000000',
			integration: 'Coming Soon',
			Type: [Array],
			name: 'Gatecoin',
			'Device availability': [Array],
			Company: 'Coinbase UK, Ltd, Coinbase Inc',
			requiredBalance: 25,
			amount: 25,
			'Accepts Fiat': true,
			'Personal Account': true,
			Languages: [Array],
			excluded_residents: [],
			kyc_template: [{ isEntered: false, name: 'test', type: 'metadata' }],
			'Fiat Withdrawal methods': [Array]
		};

		let details = getServiceDetails({ exchanges }, 'Gatecoin');
		delete details.relying_party_config;

		expect(details).toEqual(expectedExchangeDetails);
	});

	it('should return exchange hasBalance when amount of key is over the required balance', () => {
		walletTokens.tokens[0].balance = '30';
		walletTokens.tokens[1].balance = '30';

		expect(hasBalance({ exchanges, walletTokens, prices, wallet }, 'Gatecoin')).toBeTruthy();
	});

	it('should return exchange hasBalance when amount of key is equal the required balance', () => {
		walletTokens.tokens[0].balance = '25';
		walletTokens.tokens[1].balance = '25';

		expect(hasBalance({ exchanges, walletTokens, prices, wallet }, 'Gatecoin')).toBeTruthy();
	});

	it('should return exchange hasBalance false when amount of key is less than required balance', () => {
		walletTokens.tokens[0].balance = '20';
		walletTokens.tokens[1].balance = '20';
		expect(hasBalance({ exchanges, walletTokens, prices, wallet }, 'Gatecoin')).toBeFalsy();
	});
});
