export const corporateProfiles = [
	{
		name: 'full profile',
		profile: {
			identity: { type: 'corporate' },
			entityType: 'ltd',
			members: [
				{
					identity: {
						type: 'corporate',
						positions: ['director-ltd', 'shareholder'],
						equity: 10
					},
					entityType: 'ltd',
					entityName: 'Test LTD',
					email: 'test@corporate.com'
				},
				{
					identity: {
						type: 'individual',
						positions: ['director-ltd', 'shareholder'],
						equity: 12
					},
					firstName: 'testFirstName',
					lastName: 'testLastName',
					email: 'test@individual.com'
				}
			]
		},
		attribute: {
			companyType: 'ltd',
			members: [
				{
					entity: {
						type: 'corporate',
						companyType: 'ltd',
						companyName: 'Test LTD',
						email: 'test@corporate.com'
					},
					positions: [
						{ position: 'director-ltd' },
						{ position: 'shareholder', equity: 10 }
					]
				},
				{
					entity: {
						type: 'individual',
						firstName: 'testFirstName',
						lastName: 'testLastName',
						email: 'test@individual.com'
					},
					positions: [
						{ position: 'director-ltd' },
						{ position: 'shareholder', equity: 12 }
					]
				}
			]
		},
		validAttribute: true,
		throws: false
	},
	{
		name: 'No members',
		profile: {
			identity: { type: 'corporate' },
			entityType: 'ltd'
		},
		attribute: {
			companyType: 'ltd',
			members: []
		},
		throws: false,
		validAttribute: true
	},
	{
		name: 'individual profile',
		profile: {
			identity: { type: 'individual' },
			entityType: 'ltd',
			members: [
				{
					identity: {
						type: 'corporate',
						positions: ['director-ltd', 'shareholder'],
						equity: 10
					},
					entityType: 'ltd',
					entityName: 'Test LTD',
					email: 'test@corporate.com'
				},
				{
					identity: {
						type: 'individual',
						positions: ['director-ltd', 'shareholder'],
						equity: 12
					},
					firstName: 'testFirstName',
					lastName: 'testLastName',
					email: 'test@individual.com'
				}
			]
		},
		throws: 'Cannot build corporate structure for individuals'
	}
];
