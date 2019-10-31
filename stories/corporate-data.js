export const dummyProfile = {
	entityName: 'Selfkey, LLC',
	jurisdiction: 'United States',
	entityType: 'LLC',
	creationDate: '08/08/2018',
	address: '1, Amazing Loop, Singapore',
	did: 'did:selfkey:0x9cb701490ad6112d2880225c1d712f1af8c7dce1a81c44030b321fb31029cd75',
	allAttributes: []
};
export const dummyIncompleteProfile = {
	entityName: 'Selfkey, LLC',
	entityType: 'LLC',
	creationDate: '08/08/2018',
	did: false,
	allAttributes: []
};

export const corporateApplications = [
	{
		id: 1,
		title: 'Incorporation',
		rpName: 'Flag Theory',
		currentStatusName: 'pending'
	},
	{
		id: 2,
		title: 'Banking',
		rpName: 'Flag Theory',
		currentStatusName: 'rejected'
	},
	{
		id: 3,
		title: 'Banking',
		rpName: 'Bank of China',
		currentStatusName: 'approved'
	}
];

export const dummyMembers = [
	{
		id: '1',
		name: 'Giacomo Guilizzoni',
		type: 'Person',
		role: 'Director, Shareholder',
		citizenship: 'Italy',
		residency: 'Singapore',
		shares: '45%'
	},
	{
		id: '2',
		name: 'Marco Botton Ltd',
		type: 'Corporate',
		role: 'Shareholder',
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: '9%'
	},
	{
		id: '3',
		name: 'Big Things Ltd',
		type: 'Corporate',
		role: 'Shareholder',
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: '41%'
	},
	{
		id: '4',
		name: 'John Dafoe',
		type: 'Person',
		role: 'Director',
		citizenship: 'France',
		residency: 'France',
		shares: '5%'
	}
];

export const corporateCapTable = [
	{
		type: 'Person',
		role: 'Director',
		name: 'John Doe',
		email: 'john.doe@email.com',
		citizenship: 'Italy',
		residency: 'Singapore',
		shares: 0.5,
		children: []
	},
	{
		type: 'Corporate',
		role: 'Shareholder',
		name: 'ACME Inc',
		email: null,
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: 0.09,
		children: dummyMembers
	},
	{
		type: 'Corporate',
		role: 'Shareholder',
		name: 'Apple Inc',
		email: null,
		citizenship: 'U.S.A.',
		residency: 'U.S.A.',
		shares: 0.41,
		children: []
	}
];

export const entityTypes = [
	'Company Limited by Shares (LTD)',
	'Limited Liability Company (LLC)',
	'Trust (TST)',
	'Foundation (FND)',
	'Limited Partnership (LLP)',
	'Other'
];

export const legalJurisdictions = [
	'Afghanistan',
	'Albania',
	'Algeria',
	'Andorra',
	'Angola',
	'Anguilla',
	'Antigua and Barbuda',
	'Argentina',
	'Armenia',
	'Aruba',
	'Australia',
	'Austria',
	'Azerbaijan',
	'Bahamas',
	'Bangladesh',
	'Bahrain',
	'Barbados',
	'Belarus',
	'Belgium',
	'Belize',
	'Benin',
	'Bermuda',
	'Bhutan',
	'Bolivia',
	'Bosnia and Herzegovina',
	'Botswana',
	'Brazil',
	'British Virgin Islands',
	'Brunei',
	'Bulgaria',
	'Burkina Faso',
	'Burundi',
	'Cambodia',
	'Cameroon',
	'Canada',
	'Cape Verde',
	'Cayman Islands',
	'Central African Republic',
	'Chile',
	"China, People's Republic of Hong Kong",
	"China, People's Republic of Macau",
	'Taiwan',
	'Colombia',
	'Congo, Democratic Republic of the',
	'Congo, Republic of the',
	'Cook Islands',
	'Costa Rica',
	"Côte d'Ivoire",
	'Croatia',
	'Cuba',
	'Curaçao',
	'Cyprus',
	'Czech Republic',
	'Denmark',
	'Danish Realms - Faroe Islands',
	'Danish Realms - Greenland',
	'Djibouti',
	'Dominica',
	'Dominican Republic',
	'Ecuador',
	'Egypt',
	'El Salvador',
	'Eritrea',
	'Estonia',
	'Ethiopia',
	'Fiji',
	'Finland',
	'France',
	'Gabon',
	'Gambia',
	'Georgia',
	'Germany',
	'Ghana',
	'Gibraltar',
	'Greece',
	'Grenada',
	'Guatemala',
	'Guernsey, Channel Islands',
	'Guinea',
	'Guyana',
	'Haiti',
	'Honduras',
	'Hungary',
	'Iceland',
	'India',
	'Indonesia',
	'Iran',
	'Iraq',
	'Ireland',
	'Isle of Man',
	'Israel',
	'Italy',
	'Jamaica',
	'Japan',
	'Jersey, Channel Islands',
	'Jordan',
	'Kazakhstan',
	'Kenya',
	'Kiribati',
	'Kosovo',
	'Kuwait',
	'Kyrgyzstan',
	'Laos',
	'Latvia',
	'Lebanon',
	'Lesotho',
	'Liberia',
	'Liechtenstein',
	'Lithuania',
	'Luxembourg',
	'Macedonia',
	'Madagascar',
	'Malta',
	'Malawi',
	'Malaysia',
	'Maldives',
	'Mali',
	'Marshall Islands',
	'Mauritania',
	'Mauritius',
	'Mexico',
	'Micronesia, Federated States of',
	'Moldova',
	'Monaco',
	'Mongolia',
	'Montenegro',
	'Montserrat',
	'Morocco',
	'Mozambique',
	'Myanmar',
	'Namibia',
	'Nauru',
	'Nepal',
	'Netherlands',
	'Caribbean Netherlands - Bonaire',
	'Caribbean Netherlands - Sint Eustatius ',
	'Caribbean Netherlands - Saba ',
	'New Zealand',
	'Nicaragua',
	'Niger',
	'Nigeria',
	'Niue',
	'Norway',
	'Oman',
	'Pakistan',
	'Palau',
	'Palestinian territories',
	'Panama',
	'Papua New Guinea',
	'Paraguay',
	'Peru',
	'Philippines',
	'Poland',
	'Portugal',
	'Qatar',
	'Romania',
	'Russian Federation',
	'Rwanda',
	'Saint Kitts and Nevis',
	'Saint Lucia',
	'Saint Vincent and the Grenadines',
	'Samoa',
	'San Marino',
	'São Tomé and Príncipe',
	'Saudi Arabia',
	'Senegal',
	'Serbia',
	'Seychelles',
	'Sierra Leone',
	'Singapore',
	'Slovakia',
	'Slovenia',
	'Solomon Islands',
	'South Africa',
	'South Korea',
	'South Sudan',
	'Spain',
	'Sri Lanka',
	'Sint Maarten',
	'Sudan',
	'Suriname',
	'Swaziland',
	'Sweden',
	'Switzerland',
	'Tajikistan',
	'Tanzania',
	'Thailand',
	'Timor-Leste',
	'Tonga',
	'Togo',
	'Tunisia',
	'Turkey',
	'Turks and Caicos Islands',
	'Trinidad & Tobago',
	'Uganda',
	'Ukraine',
	'United Arab Emirates',
	'United Kingdom',
	'United States - Alabama',
	'United States - Alaska',
	'United States - Arizona',
	'United States - Arkansas',
	'United States - California',
	'United States - Colorado',
	'United States - Connecticut',
	'United States - Delaware',
	'United States - Florida',
	'United States - Georgia',
	'United States - Hawaii',
	'United States - Idaho',
	'United States - Illinois',
	'United States - Indiana',
	'United States - Iowa',
	'United States - Kansas',
	'United States - Kentucky',
	'United States - Louisiana',
	'United States - Maine',
	'United States - Maryland',
	'United States - Massachusetts',
	'United States - Michigan',
	'United States - Minnesota',
	'United States - Mississippi',
	'United States - Missouri',
	'United States - Montana',
	'United States - Nebraska',
	'United States - Nevada',
	'United States - New Hampshire',
	'United States - New Jersey',
	'United States - New Mexico',
	'United States - New York',
	'Uruguay',
	'Uzbekistan',
	'Vanuatu',
	'Venezuela',
	'Vietnam',
	'Yemen',
	'Zambia',
	'Zimbabwe'
];
export const corporateAttributes = [
	{
		createdAt: 1568107330518,
		updatedAt: 1568282607094,
		name: 'Company Name',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/company-name.json',
				title: 'Company Name',
				entityType: ['corporate']
			}
		},
		data: {
			value: 'ACME Inc'
		}
	},
	{
		createdAt: 1568107330518,
		updatedAt: 1568282607094,
		name: 'Entity Type',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
				title: 'Entity Type',
				entityType: ['corporate']
			}
		},
		data: {
			value: 'LLC'
		}
	},
	{
		createdAt: 1568107330518,
		updatedAt: 1568282607094,
		name: 'Jurisdiction',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json',
				title: 'Legal Jurisdiction',
				entityType: ['corporate']
			}
		},
		data: {
			value: 'Singapore'
		}
	},
	{
		createdAt: 1568107330518,
		updatedAt: 1568282607094,
		name: 'Incorporation Date',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/incorporation-date.json',
				title: 'Incorporation Date',
				entityType: ['corporate']
			}
		},
		data: {
			value: '17/10/1980'
		}
	},
	{
		createdAt: 1568107330518,
		updatedAt: 1568282607094,
		name: 'Address',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/physical-address.json',
				title: 'Address',
				entityType: ['corporate']
			}
		},
		data: {
			value: '1, Infinite Loop, California USA'
		}
	}
];

export const corporateDocuments = [
	{
		createdAt: 1568107330518,
		updatedAt: 1568282607094,
		name: 'Certificate of Incorporation',
		type: {
			content: {
				$id:
					'http://platform.selfkey.org/schema/attribute/certificate-of-incorporation.json',
				title: 'Certificate of Incorporation',
				entityType: ['corporate']
			}
		},
		documents: [
			{
				name: 'certificate.pdf',
				mimeType: 'application/pdf'
			}
		],
		data: {
			value: {
				expires: 1568282607094
			}
		}
	},
	{
		createdAt: 1568107330518,
		updatedAt: 1568282607094,
		name: 'Member Register',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/member-register.json',
				title: 'Member Register',
				entityType: ['corporate']
			}
		},
		documents: [
			{
				name: 'member_register.doc',
				mimeType: 'application/msword'
			}
		],
		data: {
			value: {
				expires: 1568107330518
			}
		}
	}
];

export const corporateMembers = [
	{
		entity: {
			type: 'individual',
			firstName: 'John',
			lastName: 'Doe',
			email: 'test@gmail.com'
		},
		attributes: [
			{
				name: 'residence',
				type: {
					content: {
						$id:
							'http://platform.selfkey.org/schema/attribute/country-of-residency.json',
						title: 'Country of Residence'
					},
					url: 'http://platform.selfkey.org/schema/attribute/country-of-residency.json'
				},
				data: {
					value: 'Russia'
				}
			},
			{
				name: 'nationality',
				type: {
					content: {
						$id: 'http://platform.selfkey.org/schema/attribute/nationality.json',
						title: 'Nationality'
					},
					url: 'http://platform.selfkey.org/schema/attribute/nationality.json'
				},
				data: {
					value: 'Australia'
				}
			}
		],
		documents: [],
		positions: [
			{
				position: 'director'
			},
			{
				position: 'shareholder',
				equity: 19
			}
		]
	},
	{
		entity: {
			type: 'corporate',
			companyType: 'Company Limited by Shares (LTD)',
			companyName: 'Test Company name',
			email: 'test@company.org'
		},
		attributes: [
			{
				title: 'incorporation',
				name: 'incorporation',
				type: {
					content: {
						$id: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json',
						title: 'Legal Jurisdiction'
					},
					url: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json'
				},
				data: {
					value: 'Hong Kong'
				}
			}
		],
		documents: [],
		positions: [
			{
				position: 'observer'
			}
		]
	}
];
