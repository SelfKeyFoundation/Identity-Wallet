import { featureIsEnabled } from '../feature-flags';

export default [
	{
		id: 'exchanges_individual',
		name: 'exchanges',
		title: 'Exchanges',
		description:
			'Compare exchange accounts and instantly sign up for a verified account without waiting for limits. Includes data on supported countries, fiat currencies, trading pairs, fees, and more.',
		entityType: 'individual',
		active: true,
		svgIcon: 'https://dl.airtable.com/ugGbCqEQSKhS3ZPOhGMH_icon-exchange-crypto.svg'
	},
	{
		id: 'incorporation_individual',
		name: 'incorporation',
		title: 'Incorporation',
		description:
			'Find the best jurisdiction to set up your business. Filter by corporate ownership, minimum shareholders, accounting requirements, privacy, tax rates, offshore tax laws, and more.',
		entityType: 'individual',
		active: true,
		svgIcon: 'https://dl.airtable.com/dt74JnTkRhae2c9zvrgW_icon-exchange-incorporations.svg.png'
	},
	{
		id: 'passports_individual',
		name: 'passports',
		title: 'Passport & Residencies',
		description:
			'Build your life internationally by getting a second residency, which opens a myriad of opportunities that will let you grow both personally and professionally.',
		entityType: 'individual',
		active: false,
		svgIcon: 'https://dl.airtable.com/U6ZlerC2SLWaly8rRk3Q_icon-exchange-passports.svg.png'
	},
	{
		id: 'bank_accounts_individual',
		name: 'bank_accounts',
		title: 'Bank Accounts',
		description:
			'Apply for international bank accounts and protect your savings in solid financial institutions with high solvency, liquidity, and prudent investment policies. ',
		entityType: 'individual',
		active: true,
		svgIcon: 'https://dl.airtable.com/wghrFU8FRI6rSM1MnYp6_icon-exchange-bank.svg.png'
	},
	{
		id: 'notaries_individual',
		name: 'notaries',
		title: 'Notaries',
		description:
			'Verify and attest the authenticity of your legal or personal documents so that they have official credibility under law.',
		entityType: 'individual',
		active: featureIsEnabled('notaries'),
		svgIcon: 'https://dl.airtable.com/cQcRdsGeQSeM3ekJFo3E_icon-exchange-notaries.svg.png'
	},
	{
		id: 'loans_individual',
		name: 'loans',
		title: 'Loans',
		description:
			'Start earning interest on your cryptocurrency or get a cash loan with your crypto assets as collaterals.',
		entityType: 'individual',
		active: true,
		svgIcon:
			'https://dl.airtable.com/.attachments/f3f557d642883b0fb004c49dfe3b89aa/6547f314/icon-marketplace-loans.svg'
	},
	{
		id: 'exchanges_corporate',
		name: 'exchanges',
		title: 'Exchanges',
		description:
			'Compare exchange accounts and instantly sign up for a verified account without waiting for limits. Includes data on supported countries, fiat currencies, trading pairs, fees, and more.',
		entityType: 'corporate',
		active: false,
		svgIcon: 'https://dl.airtable.com/ugGbCqEQSKhS3ZPOhGMH_icon-exchange-crypto.svg'
	},
	{
		id: 'incorporation_corporate',
		name: 'incorporation',
		title: 'Incorporation',
		description:
			'Find the best jurisdiction to set up your business. Filter by corporate ownership, minimum shareholders, accounting requirements, privacy, tax rates, offshore tax laws, and more.',
		entityType: 'corporate',
		active: true,
		svgIcon: 'https://dl.airtable.com/dt74JnTkRhae2c9zvrgW_icon-exchange-incorporations.svg.png'
	},
	{
		id: 'passports_corporate',
		name: 'passports',
		title: 'Passport & Residencies',
		description:
			'Build your life internationally by getting a second residency, which opens a myriad of opportunities that will let you grow both personally and professionally.',
		entityType: 'corporate',
		active: false,
		svgIcon: 'https://dl.airtable.com/U6ZlerC2SLWaly8rRk3Q_icon-exchange-passports.svg.png'
	},
	{
		id: 'bank_accounts_corporate',
		name: 'bank_accounts',
		title: 'Bank Accounts',
		description:
			'Apply for international bank accounts and protect your savings in solid financial institutions with high solvency, liquidity, and prudent investment policies. ',
		entityType: 'corporate',
		active: true,
		svgIcon: 'https://dl.airtable.com/wghrFU8FRI6rSM1MnYp6_icon-exchange-bank.svg.png'
	},
	{
		id: 'notaries_corporate',
		name: 'notaries',
		title: 'Notaries',
		description:
			'Verify and attest the authenticity of your legal or personal documents so that they have official credibility under law.',
		entityType: 'corporate',
		active: false,
		svgIcon: 'https://dl.airtable.com/cQcRdsGeQSeM3ekJFo3E_icon-exchange-notaries.svg.png'
	},
	{
		id: 'loans_corporate',
		name: 'loans',
		title: 'Loans',
		description:
			'Start earning interest on your cryptocurrency or get a cash loan with your crypto assets as collaterals.',
		entityType: 'corporate',
		active: false,
		svgIcon:
			'https://dl.airtable.com/.attachments/f3f557d642883b0fb004c49dfe3b89aa/6547f314/icon-marketplace-loans.svg'
	}
];
