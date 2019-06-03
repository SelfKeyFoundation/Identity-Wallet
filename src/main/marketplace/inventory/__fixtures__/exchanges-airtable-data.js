export default {
	entities: [
		{
			data: {
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
								url:
									'https://dl.airtable.com/zBSpjllcStqqaaATvz5o_small_icon-ex-golix.png',
								width: 36,
								height: 36
							},
							large: {
								url:
									'https://dl.airtable.com/SdRmsgHMTuqMAU7ArRCA_large_icon-ex-golix.png',
								width: 44,
								height: 44
							},
							full: {
								url:
									'https://dl.airtable.com/zYVDKgtxRI7vNM2z2ggl_full_icon-ex-golix.png',
								width: 44,
								height: 44
							}
						}
					}
				],
				location: ['Zimbabwe'],
				year_launched: 2018,
				description:
					'Our Mission at Golix is to give every person in Africa financial autonomy.',
				exchange_id: 6,
				status: 'Inactive',
				integration: 'Coming Soon',
				'KYC/AML': 'Yes',
				requiredBalance: 25,
				relying_party_config:
					'{\n  "rootEndpoint": "https://apiv2.instance.kyc-chain.com/api/v2/",\n  "endpoints": {\n    "/templates/:id": "https://apiv2.instance.kyc-chain.com/api/v2/templates/:id?format=minimum"\n  },\n  "templates": [\n    "5cbd904b4125d251f98b78ba"\n  ]\n}',
				vendor_id: 'golix',
				sku: 'golix'
			}
		},
		{
			data: {
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
				year_launched: 2017,
				description:
					'Kyber Network is a decentralized crypto-exchange focused on security and usability. The trade in Kyber Network is fast, easy and happens almost instantly. It is powered by smart contract, a new technology enabled by the Ethereum blockchain, which protects users from hacking incidents.',
				maker_fee: 'Included In Exchange Price',
				taker_fee: 'Included In Exchange Price',
				fiat_payments: ['Not Available'],
				exchange_id: 3,
				status: 'Inactive',
				integration: 'Coming Soon',
				coin_pairs: '16',
				fiat_supported: ['Not Available'],
				margin_trading: 'No',
				'KYC/AML': 'Yes',
				excluded_residents: ['None'],
				URL: 'https://kyber.network',
				email: 'N.A.',
				requiredBalance: 25,
				relying_party_config:
					'{\n  "rootEndpoint": "https://apiv2.instance.kyc-chain.com/api/v2/",\n  "endpoints": {\n    "/templates/:id": "https://apiv2.instance.kyc-chain.com/api/v2/templates/:id?format=minimum"\n  },\n  "templates": [\n    "5cbd904b4125d251f98b78ba"\n  ]\n}',
				vendor_id: 'kyber_network',
				sku: 'kyber_network'
			}
		}
	]
};
