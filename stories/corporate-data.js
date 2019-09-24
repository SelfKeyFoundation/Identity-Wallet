export const corporateApplications = [
	{
		title: 'Incorporation',
		rpName: 'Flag Theory',
		currentStatusName: 'pending'
	},
	{
		title: 'Banking',
		rpName: 'Flag Theory',
		currentStatusName: 'rejected'
	},
	{
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
