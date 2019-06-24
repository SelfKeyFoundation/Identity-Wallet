export default () => ({
	golix: {
		name: 'Golix',
		logo: [
			{
				id: 'attKFOAeaemwUtTvi',
				url: 'https://dl.airtable.com/NFsnCKOcSwqVxKXD0pN3_icon-ex-golix.png',
				filename: 'icon-ex-golix.png',
				size: 3007,
				type: 'image/png',
				thumbnails: {
					small: {
						url: 'https://dl.airtable.com/zBSpjllcStqqaaATvz5o_small_icon-ex-golix.png',
						width: 36,
						height: 36
					},
					large: {
						url: 'https://dl.airtable.com/SdRmsgHMTuqMAU7ArRCA_large_icon-ex-golix.png',
						width: 44,
						height: 44
					},
					full: {
						url: 'https://dl.airtable.com/zYVDKgtxRI7vNM2z2ggl_full_icon-ex-golix.png',
						width: 44,
						height: 44
					}
				}
			}
		],
		location: ['Zimbabwe'],
		yearLaunched: 2018,
		description: 'Our Mission at Golix is to give every person in Africa financial autonomy.',
		exchangeId: 6,
		status: 'Inactive',
		integration: 'Coming Soon',
		kycAml: 'Yes',
		requiredBalance: 25,
		relyingPartyConfig:
			'{\n  "rootEndpoint": "https://apiv2.instance.kyc-chain.com/api/v2/",\n  "endpoints": {\n    "/templates/:id": "https://apiv2.instance.kyc-chain.com/api/v2/templates/:id?format=minimum"\n  },\n  "templates": [\n    "5cbd904b4125d251f98b78ba"\n  ]\n}',
		vendorId: 'golix',
		sku: 'golix'
	},
	kyber_network: {
		name: 'Kyber Network',
		logo: [
			{
				id: 'attCT7by4Jdi34ErQ',
				url: 'https://dl.airtable.com/95zReVPuT7ev4HVnYndG_KyberBackground.png',
				filename: 'KyberBackground.png',
				size: 5302,
				type: 'image/png',
				thumbnails: {
					small: {
						url:
							'https://dl.airtable.com/ZX2oPLrcQBy5p70kD3sh_small_KyberBackground.png',
						width: 36,
						height: 36
					},
					large: {
						url:
							'https://dl.airtable.com/66ixuXrqRwCwKhLyf97e_large_KyberBackground.png',
						width: 44,
						height: 44
					},
					full: {
						url:
							'https://dl.airtable.com/kpw5QlaEQbOiGcMW1cEy_full_KyberBackground.png',
						width: 44,
						height: 44
					}
				}
			}
		],
		location: ['Singapore'],
		yearLaunched: 2017,
		description:
			'Kyber Network is a decentralized crypto-exchange focused on security and usability. The trade in Kyber Network is fast, easy and happens almost instantly. It is powered by smart contract, a new technology enabled by the Ethereum blockchain, which protects users from hacking incidents.',
		makerFee: 'Included In Exchange Price',
		takerFee: 'Included In Exchange Price',
		fiatPayments: ['Not Available'],
		exchangeId: 3,
		status: 'Inactive',
		integration: 'Coming Soon',
		coinPairs: '16',
		fiatSupported: ['Not Available'],
		marginTrading: 'No',
		kycAml: 'Yes',
		excludedResidents: ['None'],
		url: 'https://kyber.network',
		email: 'N.A.',
		requiredBalance: 25,
		relyingPartyConfig:
			'{\n  "rootEndpoint": "https://apiv2.instance.kyc-chain.com/api/v2/",\n  "endpoints": {\n    "/templates/:id": "https://apiv2.instance.kyc-chain.com/api/v2/templates/:id?format=minimum"\n  },\n  "templates": [\n    "5cbd904b4125d251f98b78ba"\n  ]\n}',
		vendorId: 'kyber_network',
		sku: 'kyber_network'
	}
});
