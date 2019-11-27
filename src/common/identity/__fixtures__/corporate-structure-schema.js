export const companyTypes = [
	'Company Limited by Shares (LTD)',
	'Limited Liability Company (LLC)',
	'Trust (TST)',
	'Foundation (FND)',
	'Limited Partnership (LLP)',
	'Other'
];
export const companyEquity = {
	'Company Limited by Shares (LTD)': 'Shares',
	'Limited Liability Company (LLC)': 'Membership Interest',
	'Trust (TST)': false,
	'Foundation (FND)': false,
	'Limited Partnership (LLP)': 'Percentage',
	Other: 'Membership Interest'
};

export const positionEquity = {
	director: false,
	shareholder: 'Shares',
	ubo: false,
	observer: false,
	authorizedSignatory: false,
	manager: false,
	member: 'Membership Interest',
	grantor: false,
	beneficiary: false,
	trustee: false,
	protector: false,
	founder: false,
	'general-partner': 'Percentage',
	'limited-partner': 'Percentage'
};

export const companyPositionWithEquity = {
	'Company Limited by Shares (LTD)': ['shareholder'],
	'Limited Liability Company (LLC)': ['member'],
	'Trust (TST)': [],
	'Foundation (FND)': [],
	'Limited Partnership (LLP)': ['general-partner', 'limited-partner'],
	Other: ['member']
};

const director = {
	title: 'Director',
	description: 'The person that is chief executive of the organization.',
	position: 'director'
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
	title: 'Authorized Signatory',
	description: 'Director or person who has been authorized to sign documents.'
};
const other = {
	position: 'other',
	title: 'Other',
	description: 'Designated nonmembers or outsiders.'
};
const member = {
	position: 'member',
	equity: 'Membership Interest',
	title: 'Member',
	description: 'Co-owner of a business, who oversees and runs the that business.'
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
const beneficiary = {
	position: 'beneficiary',
	title: 'Beneficiary',
	description: 'Person or entity that establishes the trust.'
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
	description: 'Co-owner of a business, who oversees and runs the that business.'
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
	'Company Limited by Shares (LTD)': [
		director,
		shareholder,
		ubo,
		observer,
		authorizedSignatory,
		other
	],
	'Limited Liability Company (LLC)': [manager, member, ubo, observer, authorizedSignatory, other],
	'Trust (TST)': [
		grantor,
		beneficiary,
		trustee,
		protector,
		ubo,
		observer,
		authorizedSignatory,
		other
	],
	'Foundation (FND)': [
		founder,
		director,
		supervisor,
		beneficiary,
		ubo,
		observer,
		authorizedSignatory,
		other
	],
	'Limited Partnership (LLP)': [
		generalPartner,
		limitedPartner,
		ubo,
		observer,
		authorizedSignatory,
		other
	],
	Other: [member, ubo, observer, authorizedSignatory, other]
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
						enum: ['Company Limited by Shares (LTD)']
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
						enum: ['Limited Liability Company (LLC)']
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
						enum: ['Trust (TST)']
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
						enum: ['Foundation (FND)']
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
						enum: ['Limited Partnership (LLP)']
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
						enum: ['Other']
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
							$ref: '#/definitions/positions/director'
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
						},
						{
							$ref: '#/definitions/positions/other'
						}
					]
				},
				tst: {
					oneOf: [
						{
							$ref: '#/definitions/positions/grantor'
						},
						{
							$ref: '#/definitions/positions/beneficiary'
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
							$ref: '#/definitions/positions/director'
						},
						{
							$ref: '#/definitions/positions/supervisor'
						},
						{
							$ref: '#/definitions/positions/beneficiary'
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
						},
						{
							$ref: '#/definitions/positions/other'
						}
					]
				},
				director: {
					type: 'object',
					properties: {
						position: {
							title: 'Director',
							description: 'The person that is chief executive of the organization.',
							const: 'director'
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
							title: 'Authorized Signatory',
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
				member: {
					type: 'object',
					properties: {
						position: {
							title: 'Member',
							description:
								'Co-owner of a business, who oversees and runs the that business.',
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
				beneficiary: {
					type: 'object',
					properties: {
						position: {
							title: 'Beneficiary',
							description: 'Person or entity that establishes the trust.',
							const: 'beneficiary'
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
								'Co-owner of a business, who oversees and runs the that business.',
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
							description: 'Designated nonmembers or outsiders.',
							const: 'other'
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
				enum: [
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
								enum: ['Company Limited by Shares (LTD)']
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
																	'The person that is chief executive of the organization.',
																const: 'director'
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
																title: 'Authorized Signatory',
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
								enum: ['Limited Liability Company (LLC)']
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
																	'Co-owner of a business, who oversees and runs the that business.',
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
																title: 'Authorized Signatory',
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
								enum: ['Trust (TST)']
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
																	'Person or entity that establishes the trust.',
																const: 'beneficiary'
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
																title: 'Authorized Signatory',
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
								enum: ['Foundation (FND)']
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
																const: 'director'
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
																	'Person or entity that establishes the trust.',
																const: 'beneficiary'
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
																title: 'Authorized Signatory',
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
								enum: ['Limited Partnership (LLP)']
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
																	'Co-owner of a business, who oversees and runs the that business.',
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
																title: 'Authorized Signatory',
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
								enum: ['Other']
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
																title: 'Member',
																description:
																	'Co-owner of a business, who oversees and runs the that business.',
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
																title: 'Authorized Signatory',
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
																const: 'other'
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
						enum: ['Company Limited by Shares (LTD)']
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
															'The person that is chief executive of the organization.',
														const: 'director'
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
														title: 'Authorized Signatory',
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
						enum: ['Limited Liability Company (LLC)']
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
															'Co-owner of a business, who oversees and runs the that business.',
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
														title: 'Authorized Signatory',
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
						enum: ['Trust (TST)']
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
															'Person or entity that establishes the trust.',
														const: 'beneficiary'
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
														title: 'Authorized Signatory',
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
						enum: ['Foundation (FND)']
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
														const: 'director'
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
															'Person or entity that establishes the trust.',
														const: 'beneficiary'
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
														title: 'Authorized Signatory',
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
						enum: ['Limited Partnership (LLP)']
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
															'Co-owner of a business, who oversees and runs the that business.',
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
														title: 'Authorized Signatory',
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
						enum: ['Other']
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
														title: 'Member',
														description:
															'Co-owner of a business, who oversees and runs the that business.',
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
														title: 'Authorized Signatory',
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
														const: 'other'
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
														'The person that is chief executive of the organization.',
													const: 'director'
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
													title: 'Authorized Signatory',
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
												enum: [
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
														'Co-owner of a business, who oversees and runs the that business.',
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
													title: 'Authorized Signatory',
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
												enum: [
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
														'Person or entity that establishes the trust.',
													const: 'beneficiary'
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
													title: 'Authorized Signatory',
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
												enum: [
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
													const: 'director'
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
														'Person or entity that establishes the trust.',
													const: 'beneficiary'
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
													title: 'Authorized Signatory',
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
												enum: [
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
														'Co-owner of a business, who oversees and runs the that business.',
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
													title: 'Authorized Signatory',
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
												enum: [
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
													title: 'Member',
													description:
														'Co-owner of a business, who oversees and runs the that business.',
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
													title: 'Authorized Signatory',
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
													const: 'other'
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
												enum: [
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
										'The person that is chief executive of the organization.',
									const: 'director'
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
									title: 'Authorized Signatory',
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
									description:
										'Co-owner of a business, who oversees and runs the that business.',
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
									title: 'Authorized Signatory',
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
									const: 'other'
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
									description: 'Person or entity that establishes the trust.',
									const: 'beneficiary'
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
									title: 'Authorized Signatory',
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
									const: 'director'
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
									description: 'Person or entity that establishes the trust.',
									const: 'beneficiary'
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
									title: 'Authorized Signatory',
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
										'Co-owner of a business, who oversees and runs the that business.',
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
									title: 'Authorized Signatory',
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
									title: 'Member',
									description:
										'Co-owner of a business, who oversees and runs the that business.',
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
									title: 'Authorized Signatory',
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
									const: 'other'
								}
							}
						}
					]
				},
				director: {
					type: 'object',
					properties: {
						position: {
							title: 'Director',
							description: 'The person that is chief executive of the organization.',
							const: 'director'
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
							title: 'Authorized Signatory',
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
				member: {
					type: 'object',
					properties: {
						position: {
							title: 'Member',
							description:
								'Co-owner of a business, who oversees and runs the that business.',
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
				beneficiary: {
					type: 'object',
					properties: {
						position: {
							title: 'Beneficiary',
							description: 'Person or entity that establishes the trust.',
							const: 'beneficiary'
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
								'Co-owner of a business, who oversees and runs the that business.',
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
							description: 'Designated nonmembers or outsiders.',
							const: 'other'
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
									enum: [
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
							enum: [
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
