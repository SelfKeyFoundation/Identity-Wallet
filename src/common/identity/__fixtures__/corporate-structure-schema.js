export const companyTypes = ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'];
export const companyEquity = {
	ltd: 'Shares',
	llc: 'Membership Interest',
	tst: false,
	fnd: false,
	llp: 'Percentage',
	other: 'Membership Interest'
};

export const positionEquity = {
	'director-ltd': false,
	'director-fnd': false,
	shareholder: 'Shares',
	ubo: false,
	observer: false,
	authorizedSignatory: false,
	manager: false,
	member: 'Membership Interest',
	'member-llc': 'Membership Interest',
	grantor: false,
	'beneficiary-tst': false,
	'beneficiary-fnd': false,
	trustee: false,
	protector: false,
	founder: false,
	'general-partner': 'Percentage',
	'limited-partner': 'Percentage'
};

export const companyPositionWithEquity = {
	ltd: ['shareholder'],
	llc: ['member-llc'],
	tst: [],
	fnd: [],
	llp: ['general-partner', 'limited-partner'],
	other: ['member']
};

const directorFnd = {
	title: 'Director',
	description: 'The person that is chief executive of the organization.',
	position: 'director-fnd'
};

const directorLtd = {
	title: 'Director',
	description:
		'Person from a group of managers who leads or supervises a particular area of your company.',
	position: 'director-ltd'
};

const shareholder = {
	position: 'shareholder',
	equity: 'Shares',
	title: 'Shareholder',
	description:
		'Individual or institution that legally owns one or more shares of stock in your company.'
};
const ubo = {
	position: 'ubo',
	title: 'UBO',
	description: 'The person or entity that is the ultimate beneficiary of the company.'
};
const observer = {
	position: 'observer',
	title: 'Observer',
	description: 'Individual who attends company board meetings but is not an official member.'
};
const authorizedSignatory = {
	position: 'authorizedSignatory',
	title: 'Authorised Signatory',
	description: 'Director or person who has been authorized to sign documents.'
};
const other = {
	position: 'other',
	title: 'Other',
	description: 'Other type of company members.'
};
const otherLlc = {
	position: 'other-llc',
	title: 'Other',
	description: 'Designated nonmembers or outsiders.'
};
const member = {
	position: 'member',
	equity: 'Membership Interest',
	title: 'Company Member',
	description: 'Co-owner of a business, who oversees and runs the business.'
};
const memberLlc = {
	position: 'member-llc',
	equity: 'Membership Interest',
	title: 'Member',
	description: 'Owner of a limited liability company.'
};
const manager = {
	position: 'manager',
	title: 'Manager',
	description: 'Person in charge of the LLC for day-to-day and long-term decisions.'
};
const grantor = {
	position: 'grantor',
	title: 'Grantor',
	description: 'Person or entity that establishes the trust.'
};
const beneficiaryTst = {
	position: 'beneficiary-tst',
	title: 'Beneficiary',
	description: 'Individual or group of individuals for whom a trust is created.'
};
const beneficiaryFnd = {
	position: 'beneficiary-fnd',
	title: 'Beneficiary',
	description: 'The person who gains an advantage and/or profits from the foundation.'
};
const trustee = {
	position: 'trustee',
	title: 'Trustee',
	description: 'The person who acts as the legal owner of trust assets.'
};
const protector = {
	position: 'protector',
	title: 'Protector',
	description:
		'Person who directs or restrain the trustees in relation to their administration of the trust.'
};
const founder = {
	position: 'founder',
	title: 'Founder',
	description: 'Person or entity that establishes the foundation.'
};
const generalPartner = {
	position: 'general-partner',
	equity: 'Percentage',
	title: 'General Partner',
	description: 'Co-owner of a business, who oversees and runs the business.'
};
const limitedPartner = {
	position: 'limited-partner',
	equity: 'Percentage',
	title: 'Limited Partner',
	description: 'Co-owners of a business, that does not participate in the management.'
};

const supervisor = {
	position: 'supervisor',
	title: 'Supervisor',
	description:
		'Person  who monitors and regulates employees in their performance of assigned or delegated tasks.'
};

export const companyPositions = {
	ltd: [directorLtd, shareholder, ubo, observer, authorizedSignatory, other],
	llc: [manager, memberLlc, ubo, observer, authorizedSignatory, otherLlc],
	tst: [grantor, beneficiaryTst, trustee, protector, ubo, observer, authorizedSignatory, other],
	fnd: [
		founder,
		directorFnd,
		supervisor,
		beneficiaryFnd,
		ubo,
		observer,
		authorizedSignatory,
		other
	],
	llp: [generalPartner, limitedPartner, ubo, observer, authorizedSignatory, other],
	other: [member, ubo, observer, authorizedSignatory]
};
export const resolvedCorporateSchema = {
	url: 'http://platform.selfkey.org/schema/attribute/corporate-structure.json',
	schema: {
		$id: 'http://platform.selfkey.org/schema/attribute/corporate-structure.json',
		$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
		identityAttribute: true,
		system: true,
		identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
		entityType: ['corporate'],
		title: 'Corporate Structure',
		type: 'object',
		properties: {
			companyType: {
				$ref: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json'
			}
		},
		dependencies: {
			companyType: {
				oneOf: [
					{
						$ref: '#/definitions/ltd'
					},
					{
						$ref: '#/definitions/llc'
					},
					{
						$ref: '#/definitions/tst'
					},
					{
						$ref: '#/definitions/fnd'
					},
					{
						$ref: '#/definitions/llp'
					},
					{
						$ref: '#/definitions/other_company'
					}
				]
			}
		},
		definitions: {
			equity: {
				type: 'number',
				default: 0,
				minimum: 0,
				maximum: 100
			},
			ltd: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['ltd']
					},
					members: {
						$ref: '#/definitions/members/ltd'
					}
				}
			},
			llc: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['llc']
					},
					members: {
						$ref: '#/definitions/members/llc'
					}
				}
			},
			tst: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['tst']
					},
					members: {
						$ref: '#/definitions/members/tst'
					}
				}
			},
			fnd: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['fnd']
					},
					members: {
						$ref: '#/definitions/members/fnd'
					}
				}
			},
			llp: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['llp']
					},
					members: {
						$ref: '#/definitions/members/llp'
					}
				}
			},
			other_company: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['other']
					},
					members: {
						$ref: '#/definitions/members/other_company'
					}
				}
			},
			members: {
				ltd: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/ltd'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				llc: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/llc'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				tst: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/tst'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				fnd: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/fnd'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				llp: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/llp'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				other_company: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/other_company'
								},
								minItems: 1
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				}
			},
			positions: {
				ltd: {
					type: 'object',
					oneOf: [
						{
							$ref: '#/definitions/positions/director_ltd'
						},
						{
							$ref: '#/definitions/positions/shareholder'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						},
						{
							$ref: '#/definitions/positions/other'
						}
					]
				},
				llc: {
					oneOf: [
						{
							$ref: '#/definitions/positions/manager'
						},
						{
							$ref: '#/definitions/positions/member_llc'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						},
						{
							$ref: '#/definitions/positions/other_llc'
						}
					]
				},
				tst: {
					oneOf: [
						{
							$ref: '#/definitions/positions/grantor'
						},
						{
							$ref: '#/definitions/positions/beneficiary_tst'
						},
						{
							$ref: '#/definitions/positions/trustee'
						},
						{
							$ref: '#/definitions/positions/protector'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						},
						{
							$ref: '#/definitions/positions/other'
						}
					]
				},
				fnd: {
					oneOf: [
						{
							$ref: '#/definitions/positions/founder'
						},
						{
							$ref: '#/definitions/positions/director_fnd'
						},
						{
							$ref: '#/definitions/positions/supervisor'
						},
						{
							$ref: '#/definitions/positions/beneficiary_fnd'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						},
						{
							$ref: '#/definitions/positions/other'
						}
					]
				},
				llp: {
					oneOf: [
						{
							$ref: '#/definitions/positions/generalPartner'
						},
						{
							$ref: '#/definitions/positions/limitedPartner'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						},
						{
							$ref: '#/definitions/positions/other'
						}
					]
				},
				other_company: {
					oneOf: [
						{
							$ref: '#/definitions/positions/member'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						}
					]
				},
				director_fnd: {
					type: 'object',
					properties: {
						position: {
							title: 'Director',
							description: 'The person that is chief executive of the organization.',
							const: 'director-fnd'
						}
					}
				},
				director_ltd: {
					type: 'object',
					properties: {
						position: {
							title: 'Director',
							description:
								'Person from a group of managers who leads or supervises a particular area of your company.',
							const: 'director-ltd'
						}
					}
				},
				ubo: {
					type: 'object',
					properties: {
						position: {
							title: 'UBO',
							description:
								'The person or entity that is the ultimate beneficiary of the company.',
							const: 'ubo'
						}
					}
				},
				observer: {
					type: 'object',
					properties: {
						position: {
							title: 'Observer',
							description:
								'Individual who attends company board meetings but is not an official member.',
							const: 'observer'
						}
					}
				},
				authorizedSignatory: {
					type: 'object',
					properties: {
						position: {
							title: 'Authorised Signatory',
							description:
								'Director or person who has been authorized to sign documents.',
							const: 'authorizedSignatory'
						}
					}
				},
				shareholder: {
					type: 'object',
					properties: {
						position: {
							title: 'Shareholder',
							description:
								'Individual or institution that legally owns one or more shares of stock in your company.',
							const: 'shareholder'
						},
						equity: {
							title: 'Shares',
							$ref: '#/definitions/equity'
						}
					}
				},
				member_llc: {
					type: 'object',
					properties: {
						position: {
							title: 'Member',
							description: 'Owner of a limited liability company.',
							const: 'member-llc'
						},
						equity: {
							title: 'Membership Interest',
							$ref: '#/definitions/equity'
						}
					}
				},
				member: {
					type: 'object',
					properties: {
						position: {
							title: 'Company Member',
							description:
								'Co-owner of a business, who oversees and runs the business.',
							const: 'member'
						},
						equity: {
							title: 'Membership Interest',
							$ref: '#/definitions/equity'
						}
					}
				},
				manager: {
					type: 'object',
					properties: {
						position: {
							title: 'Manager',
							description:
								'Person in charge of the LLC for day-to-day and long-term decisions.',
							const: 'manager'
						}
					}
				},
				grantor: {
					type: 'object',
					properties: {
						position: {
							title: 'Grantor',
							description: 'Person or entity that establishes the trust.',
							const: 'grantor'
						}
					}
				},
				beneficiary_tst: {
					type: 'object',
					properties: {
						position: {
							title: 'Beneficiary',
							description:
								'Individual or group of individuals for whom a trust is created.',
							const: 'beneficiary-tst'
						}
					}
				},
				beneficiary_fnd: {
					type: 'object',
					properties: {
						position: {
							title: 'Beneficiary',
							description:
								'The person who gains an advantage and/or profits from the foundation.',
							const: 'beneficiary-fnd'
						}
					}
				},
				trustee: {
					type: 'object',
					properties: {
						position: {
							title: 'Trustee',
							description: 'The person who acts as the legal owner of trust assets.',
							const: 'trustee'
						}
					}
				},
				protector: {
					type: 'object',
					properties: {
						position: {
							title: 'Protector',
							description:
								'Person who directs or restrain the trustees in relation to their administration of the trust.',
							const: 'protector'
						}
					}
				},
				founder: {
					type: 'object',
					properties: {
						position: {
							title: 'Founder',
							description: 'Person or entity that establishes the foundation.',
							const: 'founder'
						}
					}
				},
				supervisor: {
					type: 'object',
					properties: {
						position: {
							title: 'Supervisor',
							description:
								'Person  who monitors and regulates employees in their performance of assigned or delegated tasks.',
							const: 'supervisor'
						}
					}
				},
				generalPartner: {
					type: 'object',
					properties: {
						position: {
							title: 'General Partner',
							description:
								'Co-owner of a business, who oversees and runs the business.',
							const: 'general-partner'
						},
						equity: {
							$ref: '#/definitions/equity'
						}
					}
				},
				limitedPartner: {
					type: 'object',
					properties: {
						position: {
							title: 'Limited Partner',
							description:
								'Co-owners of a business, that does not participate in the management.',
							const: 'limited-partner'
						},
						equity: {
							$ref: '#/definitions/equity'
						}
					}
				},
				other: {
					type: 'object',
					properties: {
						position: {
							title: 'Other',
							description: 'Other type of company members.',
							const: 'other'
						}
					}
				},
				other_llc: {
					type: 'object',
					properties: {
						position: {
							title: 'Other',
							description: 'Designated nonmembers or outsiders.',
							const: 'other-llc'
						}
					}
				}
			},
			entities: {
				entity: {
					oneOf: [
						{
							$ref: '#/definitions/entities/individual'
						},
						{
							$ref: '#/definitions/entities/corporate'
						}
					]
				},
				individual: {
					type: 'object',
					properties: {
						type: {
							const: 'individual'
						},
						firstName: {
							$ref: 'http://platform.selfkey.org/schema/attribute/first-name.json'
						},
						lastName: {
							$ref: 'http://platform.selfkey.org/schema/attribute/last-name.json'
						},
						email: {
							$ref: 'http://platform.selfkey.org/schema/attribute/email.json'
						}
					},
					required: ['type', 'email']
				},
				corporate: {
					type: 'object',
					properties: {
						type: {
							const: 'corporate'
						},
						companyType: {
							$ref:
								'http://platform.selfkey.org/schema/attribute/legal-entity-type.json'
						},
						companyName: {
							$ref: 'http://platform.selfkey.org/schema/attribute/company-name.json'
						},
						email: {
							$ref: 'http://platform.selfkey.org/schema/attribute/email.json'
						}
					},
					required: ['type', 'email', 'companyType', 'companyName']
				}
			}
		},
		required: ['companyType', 'members']
	},
	dereferenced: {
		$id: 'http://platform.selfkey.org/schema/attribute/corporate-structure.json',
		$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
		identityAttribute: true,
		system: true,
		identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
		entityType: ['corporate'],
		title: 'Corporate Structure',
		type: 'object',
		properties: {
			companyType: {
				$id: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				entityType: ['corporate'],
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				title: 'Legal Entity Type',
				description: 'Please specify the type of legal entity.',
				type: 'string',
				enum: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'],
				enumNames: [
					'Company Limited by Shares (LTD)',
					'Limited Liability Company (LLC)',
					'Trust (TST)',
					'Foundation (FND)',
					'Limited Partnership (LLP)',
					'Other'
				]
			}
		},
		dependencies: {
			companyType: {
				oneOf: [
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['ltd']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												type: 'object',
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																title: 'Director',
																description:
																	'Person from a group of managers who leads or supervises a particular area of your company.',
																const: 'director-ltd'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Shareholder',
																description:
																	'Individual or institution that legally owns one or more shares of stock in your company.',
																const: 'shareholder'
															},
															equity: {
																title: 'Shares',
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'UBO',
																description:
																	'The person or entity that is the ultimate beneficiary of the company.',
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Observer',
																description:
																	'Individual who attends company board meetings but is not an official member.',
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Authorised Signatory',
																description:
																	'Director or person who has been authorized to sign documents.',
																const: 'authorizedSignatory'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Other',
																description:
																	'Other type of company members.',
																const: 'other'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'ltd',
																'llc',
																'tst',
																'fnd',
																'llp',
																'other'
															],
															enumNames: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['llc']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																title: 'Manager',
																description:
																	'Person in charge of the LLC for day-to-day and long-term decisions.',
																const: 'manager'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Member',
																description:
																	'Owner of a limited liability company.',
																const: 'member-llc'
															},
															equity: {
																title: 'Membership Interest',
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'UBO',
																description:
																	'The person or entity that is the ultimate beneficiary of the company.',
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Observer',
																description:
																	'Individual who attends company board meetings but is not an official member.',
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Authorised Signatory',
																description:
																	'Director or person who has been authorized to sign documents.',
																const: 'authorizedSignatory'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Other',
																description:
																	'Designated nonmembers or outsiders.',
																const: 'other-llc'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'ltd',
																'llc',
																'tst',
																'fnd',
																'llp',
																'other'
															],
															enumNames: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['tst']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																title: 'Grantor',
																description:
																	'Person or entity that establishes the trust.',
																const: 'grantor'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Beneficiary',
																description:
																	'Individual or group of individuals for whom a trust is created.',
																const: 'beneficiary-tst'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Trustee',
																description:
																	'The person who acts as the legal owner of trust assets.',
																const: 'trustee'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Protector',
																description:
																	'Person who directs or restrain the trustees in relation to their administration of the trust.',
																const: 'protector'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'UBO',
																description:
																	'The person or entity that is the ultimate beneficiary of the company.',
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Observer',
																description:
																	'Individual who attends company board meetings but is not an official member.',
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Authorised Signatory',
																description:
																	'Director or person who has been authorized to sign documents.',
																const: 'authorizedSignatory'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Other',
																description:
																	'Other type of company members.',
																const: 'other'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'ltd',
																'llc',
																'tst',
																'fnd',
																'llp',
																'other'
															],
															enumNames: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['fnd']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																title: 'Founder',
																description:
																	'Person or entity that establishes the foundation.',
																const: 'founder'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Director',
																description:
																	'The person that is chief executive of the organization.',
																const: 'director-fnd'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Supervisor',
																description:
																	'Person  who monitors and regulates employees in their performance of assigned or delegated tasks.',
																const: 'supervisor'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Beneficiary',
																description:
																	'The person who gains an advantage and/or profits from the foundation.',
																const: 'beneficiary-fnd'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'UBO',
																description:
																	'The person or entity that is the ultimate beneficiary of the company.',
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Observer',
																description:
																	'Individual who attends company board meetings but is not an official member.',
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Authorised Signatory',
																description:
																	'Director or person who has been authorized to sign documents.',
																const: 'authorizedSignatory'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Other',
																description:
																	'Other type of company members.',
																const: 'other'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'ltd',
																'llc',
																'tst',
																'fnd',
																'llp',
																'other'
															],
															enumNames: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['llp']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																title: 'General Partner',
																description:
																	'Co-owner of a business, who oversees and runs the business.',
																const: 'general-partner'
															},
															equity: {
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Limited Partner',
																description:
																	'Co-owners of a business, that does not participate in the management.',
																const: 'limited-partner'
															},
															equity: {
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'UBO',
																description:
																	'The person or entity that is the ultimate beneficiary of the company.',
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Observer',
																description:
																	'Individual who attends company board meetings but is not an official member.',
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Authorised Signatory',
																description:
																	'Director or person who has been authorized to sign documents.',
																const: 'authorizedSignatory'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Other',
																description:
																	'Other type of company members.',
																const: 'other'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'ltd',
																'llc',
																'tst',
																'fnd',
																'llp',
																'other'
															],
															enumNames: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['other']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																title: 'Company Member',
																description:
																	'Co-owner of a business, who oversees and runs the business.',
																const: 'member'
															},
															equity: {
																title: 'Membership Interest',
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'UBO',
																description:
																	'The person or entity that is the ultimate beneficiary of the company.',
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Observer',
																description:
																	'Individual who attends company board meetings but is not an official member.',
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																title: 'Authorised Signatory',
																description:
																	'Director or person who has been authorized to sign documents.',
																const: 'authorizedSignatory'
															}
														}
													}
												]
											},
											minItems: 1
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'ltd',
																'llc',
																'tst',
																'fnd',
																'llp',
																'other'
															],
															enumNames: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					}
				]
			}
		},
		definitions: {
			equity: {
				type: 'number',
				default: 0,
				minimum: 0,
				maximum: 100
			},
			ltd: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['ltd']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										type: 'object',
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														title: 'Director',
														description:
															'Person from a group of managers who leads or supervises a particular area of your company.',
														const: 'director-ltd'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Shareholder',
														description:
															'Individual or institution that legally owns one or more shares of stock in your company.',
														const: 'shareholder'
													},
													equity: {
														title: 'Shares',
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'UBO',
														description:
															'The person or entity that is the ultimate beneficiary of the company.',
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Observer',
														description:
															'Individual who attends company board meetings but is not an official member.',
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Authorised Signatory',
														description:
															'Director or person who has been authorized to sign documents.',
														const: 'authorizedSignatory'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Other',
														description:
															'Other type of company members.',
														const: 'other'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'ltd',
														'llc',
														'tst',
														'fnd',
														'llp',
														'other'
													],
													enumNames: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			llc: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['llc']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														title: 'Manager',
														description:
															'Person in charge of the LLC for day-to-day and long-term decisions.',
														const: 'manager'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Member',
														description:
															'Owner of a limited liability company.',
														const: 'member-llc'
													},
													equity: {
														title: 'Membership Interest',
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'UBO',
														description:
															'The person or entity that is the ultimate beneficiary of the company.',
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Observer',
														description:
															'Individual who attends company board meetings but is not an official member.',
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Authorised Signatory',
														description:
															'Director or person who has been authorized to sign documents.',
														const: 'authorizedSignatory'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Other',
														description:
															'Designated nonmembers or outsiders.',
														const: 'other-llc'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'ltd',
														'llc',
														'tst',
														'fnd',
														'llp',
														'other'
													],
													enumNames: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			tst: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['tst']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														title: 'Grantor',
														description:
															'Person or entity that establishes the trust.',
														const: 'grantor'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Beneficiary',
														description:
															'Individual or group of individuals for whom a trust is created.',
														const: 'beneficiary-tst'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Trustee',
														description:
															'The person who acts as the legal owner of trust assets.',
														const: 'trustee'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Protector',
														description:
															'Person who directs or restrain the trustees in relation to their administration of the trust.',
														const: 'protector'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'UBO',
														description:
															'The person or entity that is the ultimate beneficiary of the company.',
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Observer',
														description:
															'Individual who attends company board meetings but is not an official member.',
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Authorised Signatory',
														description:
															'Director or person who has been authorized to sign documents.',
														const: 'authorizedSignatory'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Other',
														description:
															'Other type of company members.',
														const: 'other'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'ltd',
														'llc',
														'tst',
														'fnd',
														'llp',
														'other'
													],
													enumNames: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			fnd: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['fnd']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														title: 'Founder',
														description:
															'Person or entity that establishes the foundation.',
														const: 'founder'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Director',
														description:
															'The person that is chief executive of the organization.',
														const: 'director-fnd'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Supervisor',
														description:
															'Person  who monitors and regulates employees in their performance of assigned or delegated tasks.',
														const: 'supervisor'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Beneficiary',
														description:
															'The person who gains an advantage and/or profits from the foundation.',
														const: 'beneficiary-fnd'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'UBO',
														description:
															'The person or entity that is the ultimate beneficiary of the company.',
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Observer',
														description:
															'Individual who attends company board meetings but is not an official member.',
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Authorised Signatory',
														description:
															'Director or person who has been authorized to sign documents.',
														const: 'authorizedSignatory'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Other',
														description:
															'Other type of company members.',
														const: 'other'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'ltd',
														'llc',
														'tst',
														'fnd',
														'llp',
														'other'
													],
													enumNames: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			llp: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['llp']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														title: 'General Partner',
														description:
															'Co-owner of a business, who oversees and runs the business.',
														const: 'general-partner'
													},
													equity: {
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Limited Partner',
														description:
															'Co-owners of a business, that does not participate in the management.',
														const: 'limited-partner'
													},
													equity: {
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'UBO',
														description:
															'The person or entity that is the ultimate beneficiary of the company.',
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Observer',
														description:
															'Individual who attends company board meetings but is not an official member.',
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Authorised Signatory',
														description:
															'Director or person who has been authorized to sign documents.',
														const: 'authorizedSignatory'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Other',
														description:
															'Other type of company members.',
														const: 'other'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'ltd',
														'llc',
														'tst',
														'fnd',
														'llp',
														'other'
													],
													enumNames: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			other_company: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['other']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														title: 'Company Member',
														description:
															'Co-owner of a business, who oversees and runs the business.',
														const: 'member'
													},
													equity: {
														title: 'Membership Interest',
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'UBO',
														description:
															'The person or entity that is the ultimate beneficiary of the company.',
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Observer',
														description:
															'Individual who attends company board meetings but is not an official member.',
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														title: 'Authorised Signatory',
														description:
															'Director or person who has been authorized to sign documents.',
														const: 'authorizedSignatory'
													}
												}
											}
										]
									},
									minItems: 1
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'ltd',
														'llc',
														'tst',
														'fnd',
														'llp',
														'other'
													],
													enumNames: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			members: {
				ltd: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									type: 'object',
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													title: 'Director',
													description:
														'Person from a group of managers who leads or supervises a particular area of your company.',
													const: 'director-ltd'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Shareholder',
													description:
														'Individual or institution that legally owns one or more shares of stock in your company.',
													const: 'shareholder'
												},
												equity: {
													title: 'Shares',
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'UBO',
													description:
														'The person or entity that is the ultimate beneficiary of the company.',
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Observer',
													description:
														'Individual who attends company board meetings but is not an official member.',
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Authorised Signatory',
													description:
														'Director or person who has been authorized to sign documents.',
													const: 'authorizedSignatory'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Other',
													description: 'Other type of company members.',
													const: 'other'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'],
												enumNames: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				llc: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													title: 'Manager',
													description:
														'Person in charge of the LLC for day-to-day and long-term decisions.',
													const: 'manager'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Member',
													description:
														'Owner of a limited liability company.',
													const: 'member-llc'
												},
												equity: {
													title: 'Membership Interest',
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'UBO',
													description:
														'The person or entity that is the ultimate beneficiary of the company.',
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Observer',
													description:
														'Individual who attends company board meetings but is not an official member.',
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Authorised Signatory',
													description:
														'Director or person who has been authorized to sign documents.',
													const: 'authorizedSignatory'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Other',
													description:
														'Designated nonmembers or outsiders.',
													const: 'other-llc'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'],
												enumNames: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				tst: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													title: 'Grantor',
													description:
														'Person or entity that establishes the trust.',
													const: 'grantor'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Beneficiary',
													description:
														'Individual or group of individuals for whom a trust is created.',
													const: 'beneficiary-tst'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Trustee',
													description:
														'The person who acts as the legal owner of trust assets.',
													const: 'trustee'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Protector',
													description:
														'Person who directs or restrain the trustees in relation to their administration of the trust.',
													const: 'protector'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'UBO',
													description:
														'The person or entity that is the ultimate beneficiary of the company.',
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Observer',
													description:
														'Individual who attends company board meetings but is not an official member.',
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Authorised Signatory',
													description:
														'Director or person who has been authorized to sign documents.',
													const: 'authorizedSignatory'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Other',
													description: 'Other type of company members.',
													const: 'other'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'],
												enumNames: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				fnd: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													title: 'Founder',
													description:
														'Person or entity that establishes the foundation.',
													const: 'founder'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Director',
													description:
														'The person that is chief executive of the organization.',
													const: 'director-fnd'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Supervisor',
													description:
														'Person  who monitors and regulates employees in their performance of assigned or delegated tasks.',
													const: 'supervisor'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Beneficiary',
													description:
														'The person who gains an advantage and/or profits from the foundation.',
													const: 'beneficiary-fnd'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'UBO',
													description:
														'The person or entity that is the ultimate beneficiary of the company.',
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Observer',
													description:
														'Individual who attends company board meetings but is not an official member.',
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Authorised Signatory',
													description:
														'Director or person who has been authorized to sign documents.',
													const: 'authorizedSignatory'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Other',
													description: 'Other type of company members.',
													const: 'other'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'],
												enumNames: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				llp: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													title: 'General Partner',
													description:
														'Co-owner of a business, who oversees and runs the business.',
													const: 'general-partner'
												},
												equity: {
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Limited Partner',
													description:
														'Co-owners of a business, that does not participate in the management.',
													const: 'limited-partner'
												},
												equity: {
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'UBO',
													description:
														'The person or entity that is the ultimate beneficiary of the company.',
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Observer',
													description:
														'Individual who attends company board meetings but is not an official member.',
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Authorised Signatory',
													description:
														'Director or person who has been authorized to sign documents.',
													const: 'authorizedSignatory'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Other',
													description: 'Other type of company members.',
													const: 'other'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'],
												enumNames: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				other_company: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													title: 'Company Member',
													description:
														'Co-owner of a business, who oversees and runs the business.',
													const: 'member'
												},
												equity: {
													title: 'Membership Interest',
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'UBO',
													description:
														'The person or entity that is the ultimate beneficiary of the company.',
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Observer',
													description:
														'Individual who attends company board meetings but is not an official member.',
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													title: 'Authorised Signatory',
													description:
														'Director or person who has been authorized to sign documents.',
													const: 'authorizedSignatory'
												}
											}
										}
									]
								},
								minItems: 1
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'],
												enumNames: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				}
			},
			positions: {
				ltd: {
					type: 'object',
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									title: 'Director',
									description:
										'Person from a group of managers who leads or supervises a particular area of your company.',
									const: 'director-ltd'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Shareholder',
									description:
										'Individual or institution that legally owns one or more shares of stock in your company.',
									const: 'shareholder'
								},
								equity: {
									title: 'Shares',
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'UBO',
									description:
										'The person or entity that is the ultimate beneficiary of the company.',
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Observer',
									description:
										'Individual who attends company board meetings but is not an official member.',
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Authorised Signatory',
									description:
										'Director or person who has been authorized to sign documents.',
									const: 'authorizedSignatory'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Other',
									description: 'Other type of company members.',
									const: 'other'
								}
							}
						}
					]
				},
				llc: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									title: 'Manager',
									description:
										'Person in charge of the LLC for day-to-day and long-term decisions.',
									const: 'manager'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Member',
									description: 'Owner of a limited liability company.',
									const: 'member-llc'
								},
								equity: {
									title: 'Membership Interest',
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'UBO',
									description:
										'The person or entity that is the ultimate beneficiary of the company.',
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Observer',
									description:
										'Individual who attends company board meetings but is not an official member.',
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Authorised Signatory',
									description:
										'Director or person who has been authorized to sign documents.',
									const: 'authorizedSignatory'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Other',
									description: 'Designated nonmembers or outsiders.',
									const: 'other-llc'
								}
							}
						}
					]
				},
				tst: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									title: 'Grantor',
									description: 'Person or entity that establishes the trust.',
									const: 'grantor'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Beneficiary',
									description:
										'Individual or group of individuals for whom a trust is created.',
									const: 'beneficiary-tst'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Trustee',
									description:
										'The person who acts as the legal owner of trust assets.',
									const: 'trustee'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Protector',
									description:
										'Person who directs or restrain the trustees in relation to their administration of the trust.',
									const: 'protector'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'UBO',
									description:
										'The person or entity that is the ultimate beneficiary of the company.',
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Observer',
									description:
										'Individual who attends company board meetings but is not an official member.',
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Authorised Signatory',
									description:
										'Director or person who has been authorized to sign documents.',
									const: 'authorizedSignatory'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Other',
									description: 'Other type of company members.',
									const: 'other'
								}
							}
						}
					]
				},
				fnd: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									title: 'Founder',
									description:
										'Person or entity that establishes the foundation.',
									const: 'founder'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Director',
									description:
										'The person that is chief executive of the organization.',
									const: 'director-fnd'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Supervisor',
									description:
										'Person  who monitors and regulates employees in their performance of assigned or delegated tasks.',
									const: 'supervisor'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Beneficiary',
									description:
										'The person who gains an advantage and/or profits from the foundation.',
									const: 'beneficiary-fnd'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'UBO',
									description:
										'The person or entity that is the ultimate beneficiary of the company.',
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Observer',
									description:
										'Individual who attends company board meetings but is not an official member.',
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Authorised Signatory',
									description:
										'Director or person who has been authorized to sign documents.',
									const: 'authorizedSignatory'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Other',
									description: 'Other type of company members.',
									const: 'other'
								}
							}
						}
					]
				},
				llp: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									title: 'General Partner',
									description:
										'Co-owner of a business, who oversees and runs the business.',
									const: 'general-partner'
								},
								equity: {
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Limited Partner',
									description:
										'Co-owners of a business, that does not participate in the management.',
									const: 'limited-partner'
								},
								equity: {
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'UBO',
									description:
										'The person or entity that is the ultimate beneficiary of the company.',
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Observer',
									description:
										'Individual who attends company board meetings but is not an official member.',
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Authorised Signatory',
									description:
										'Director or person who has been authorized to sign documents.',
									const: 'authorizedSignatory'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Other',
									description: 'Other type of company members.',
									const: 'other'
								}
							}
						}
					]
				},
				other_company: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									title: 'Company Member',
									description:
										'Co-owner of a business, who oversees and runs the business.',
									const: 'member'
								},
								equity: {
									title: 'Membership Interest',
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'UBO',
									description:
										'The person or entity that is the ultimate beneficiary of the company.',
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Observer',
									description:
										'Individual who attends company board meetings but is not an official member.',
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									title: 'Authorised Signatory',
									description:
										'Director or person who has been authorized to sign documents.',
									const: 'authorizedSignatory'
								}
							}
						}
					]
				},
				director_fnd: {
					type: 'object',
					properties: {
						position: {
							title: 'Director',
							description: 'The person that is chief executive of the organization.',
							const: 'director-fnd'
						}
					}
				},
				director_ltd: {
					type: 'object',
					properties: {
						position: {
							title: 'Director',
							description:
								'Person from a group of managers who leads or supervises a particular area of your company.',
							const: 'director-ltd'
						}
					}
				},
				ubo: {
					type: 'object',
					properties: {
						position: {
							title: 'UBO',
							description:
								'The person or entity that is the ultimate beneficiary of the company.',
							const: 'ubo'
						}
					}
				},
				observer: {
					type: 'object',
					properties: {
						position: {
							title: 'Observer',
							description:
								'Individual who attends company board meetings but is not an official member.',
							const: 'observer'
						}
					}
				},
				authorizedSignatory: {
					type: 'object',
					properties: {
						position: {
							title: 'Authorised Signatory',
							description:
								'Director or person who has been authorized to sign documents.',
							const: 'authorizedSignatory'
						}
					}
				},
				shareholder: {
					type: 'object',
					properties: {
						position: {
							title: 'Shareholder',
							description:
								'Individual or institution that legally owns one or more shares of stock in your company.',
							const: 'shareholder'
						},
						equity: {
							title: 'Shares',
							type: 'number',
							default: 0,
							minimum: 0,
							maximum: 100
						}
					}
				},
				member_llc: {
					type: 'object',
					properties: {
						position: {
							title: 'Member',
							description: 'Owner of a limited liability company.',
							const: 'member-llc'
						},
						equity: {
							title: 'Membership Interest',
							type: 'number',
							default: 0,
							minimum: 0,
							maximum: 100
						}
					}
				},
				member: {
					type: 'object',
					properties: {
						position: {
							title: 'Company Member',
							description:
								'Co-owner of a business, who oversees and runs the business.',
							const: 'member'
						},
						equity: {
							title: 'Membership Interest',
							type: 'number',
							default: 0,
							minimum: 0,
							maximum: 100
						}
					}
				},
				manager: {
					type: 'object',
					properties: {
						position: {
							title: 'Manager',
							description:
								'Person in charge of the LLC for day-to-day and long-term decisions.',
							const: 'manager'
						}
					}
				},
				grantor: {
					type: 'object',
					properties: {
						position: {
							title: 'Grantor',
							description: 'Person or entity that establishes the trust.',
							const: 'grantor'
						}
					}
				},
				beneficiary_tst: {
					type: 'object',
					properties: {
						position: {
							title: 'Beneficiary',
							description:
								'Individual or group of individuals for whom a trust is created.',
							const: 'beneficiary-tst'
						}
					}
				},
				beneficiary_fnd: {
					type: 'object',
					properties: {
						position: {
							title: 'Beneficiary',
							description:
								'The person who gains an advantage and/or profits from the foundation.',
							const: 'beneficiary-fnd'
						}
					}
				},
				trustee: {
					type: 'object',
					properties: {
						position: {
							title: 'Trustee',
							description: 'The person who acts as the legal owner of trust assets.',
							const: 'trustee'
						}
					}
				},
				protector: {
					type: 'object',
					properties: {
						position: {
							title: 'Protector',
							description:
								'Person who directs or restrain the trustees in relation to their administration of the trust.',
							const: 'protector'
						}
					}
				},
				founder: {
					type: 'object',
					properties: {
						position: {
							title: 'Founder',
							description: 'Person or entity that establishes the foundation.',
							const: 'founder'
						}
					}
				},
				supervisor: {
					type: 'object',
					properties: {
						position: {
							title: 'Supervisor',
							description:
								'Person  who monitors and regulates employees in their performance of assigned or delegated tasks.',
							const: 'supervisor'
						}
					}
				},
				generalPartner: {
					type: 'object',
					properties: {
						position: {
							title: 'General Partner',
							description:
								'Co-owner of a business, who oversees and runs the business.',
							const: 'general-partner'
						},
						equity: {
							type: 'number',
							default: 0,
							minimum: 0,
							maximum: 100
						}
					}
				},
				limitedPartner: {
					type: 'object',
					properties: {
						position: {
							title: 'Limited Partner',
							description:
								'Co-owners of a business, that does not participate in the management.',
							const: 'limited-partner'
						},
						equity: {
							type: 'number',
							default: 0,
							minimum: 0,
							maximum: 100
						}
					}
				},
				other: {
					type: 'object',
					properties: {
						position: {
							title: 'Other',
							description: 'Other type of company members.',
							const: 'other'
						}
					}
				},
				other_llc: {
					type: 'object',
					properties: {
						position: {
							title: 'Other',
							description: 'Designated nonmembers or outsiders.',
							const: 'other-llc'
						}
					}
				}
			},
			entities: {
				entity: {
					oneOf: [
						{
							type: 'object',
							properties: {
								type: {
									const: 'individual'
								},
								firstName: {
									$id:
										'http://platform.selfkey.org/schema/attribute/first-name.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['individual'],
									title: 'First Name',
									description: 'Given Name.',
									type: 'string'
								},
								lastName: {
									$id:
										'http://platform.selfkey.org/schema/attribute/last-name.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['individual'],
									title: 'Last Name',
									description: 'Family Name.',
									type: 'string'
								},
								email: {
									$id: 'http://platform.selfkey.org/schema/attribute/email.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['corporate', 'individual'],
									title: 'Email',
									description: 'Please enter your e-mail address.',
									type: 'string',
									format: 'email'
								}
							},
							required: ['type', 'email']
						},
						{
							type: 'object',
							properties: {
								type: {
									const: 'corporate'
								},
								companyType: {
									$id:
										'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									entityType: ['corporate'],
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									title: 'Legal Entity Type',
									description: 'Please specify the type of legal entity.',
									type: 'string',
									enum: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'],
									enumNames: [
										'Company Limited by Shares (LTD)',
										'Limited Liability Company (LLC)',
										'Trust (TST)',
										'Foundation (FND)',
										'Limited Partnership (LLP)',
										'Other'
									]
								},
								companyName: {
									$id:
										'http://platform.selfkey.org/schema/attribute/company-name.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['corporate'],
									title: 'Company Name',
									description:
										'Please provide the name of your company, as it appears in official documents.',
									type: 'string'
								},
								email: {
									$id: 'http://platform.selfkey.org/schema/attribute/email.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['corporate', 'individual'],
									title: 'Email',
									description: 'Please enter your e-mail address.',
									type: 'string',
									format: 'email'
								}
							},
							required: ['type', 'email', 'companyType', 'companyName']
						}
					]
				},
				individual: {
					type: 'object',
					properties: {
						type: {
							const: 'individual'
						},
						firstName: {
							$id: 'http://platform.selfkey.org/schema/attribute/first-name.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['individual'],
							title: 'First Name',
							description: 'Given Name.',
							type: 'string'
						},
						lastName: {
							$id: 'http://platform.selfkey.org/schema/attribute/last-name.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['individual'],
							title: 'Last Name',
							description: 'Family Name.',
							type: 'string'
						},
						email: {
							$id: 'http://platform.selfkey.org/schema/attribute/email.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['corporate', 'individual'],
							title: 'Email',
							description: 'Please enter your e-mail address.',
							type: 'string',
							format: 'email'
						}
					},
					required: ['type', 'email']
				},
				corporate: {
					type: 'object',
					properties: {
						type: {
							const: 'corporate'
						},
						companyType: {
							$id:
								'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							entityType: ['corporate'],
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							title: 'Legal Entity Type',
							description: 'Please specify the type of legal entity.',
							type: 'string',
							enum: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other'],
							enumNames: [
								'Company Limited by Shares (LTD)',
								'Limited Liability Company (LLC)',
								'Trust (TST)',
								'Foundation (FND)',
								'Limited Partnership (LLP)',
								'Other'
							]
						},
						companyName: {
							$id: 'http://platform.selfkey.org/schema/attribute/company-name.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['corporate'],
							title: 'Company Name',
							description:
								'Please provide the name of your company, as it appears in official documents.',
							type: 'string'
						},
						email: {
							$id: 'http://platform.selfkey.org/schema/attribute/email.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['corporate', 'individual'],
							title: 'Email',
							description: 'Please enter your e-mail address.',
							type: 'string',
							format: 'email'
						}
					},
					required: ['type', 'email', 'companyType', 'companyName']
				}
			}
		},
		required: ['companyType', 'members']
	}
};
