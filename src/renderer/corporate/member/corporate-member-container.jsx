import React, { PureComponent } from 'react';
import _ from 'lodash';
import { CorporateMemberForm } from './corporate-member-form';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { appSelectors } from 'common/app';
import { identityAttributes } from 'common/identity/utils';
import { identityOperations, identitySelectors } from 'common/identity';
import {
	EMAIL_ATTRIBUTE,
	FIRST_NAME_ATTRIBUTE,
	LAST_NAME_ATTRIBUTE,
	JURISDICTION_ATTRIBUTE,
	ENTITY_TYPE_ATTRIBUTE,
	TAX_ID_ATTRIBUTE,
	ENTITY_NAME_ATTRIBUTE,
	CREATION_DATE_ATTRIBUTE,
	COUNTRY_ATTRIBUTE,
	NATIONALITY_ATTRIBUTE,
	PHONE_NUMBER_ATTRIBUTE
} from 'common/identity/constants';

const styles = theme => ({});

const commonFields = ['equity', 'positions', 'type', 'did', 'parentId'];
const corporateFields = [
	'jurisdiction',
	'taxId',
	'entityType',
	'email',
	'entityName',
	'creationDate'
];
const individualFields = [
	'firstName',
	'lastName',
	'nationality',
	'country',
	'email',
	'phoneNumber'
];

class CorporateMemberContainerComponent extends PureComponent {
	constructor(props) {
		super(props);
		const { member, profile } = props;

		this.state = {
			errors: { hasErrors: false },
			type: profile ? profile.identity.type : 'individual',
			equity: profile ? profile.identity.equity : '',
			positions: profile ? this.filterAcceptablePositions(profile.identity.positions) : [],
			did: profile && profile.identity.did ? profile.identity.did : '',
			parentId: props.parentId ? props.parentId : props.companies[0].identity.id,
			email: member[EMAIL_ATTRIBUTE],
			firstName: member[FIRST_NAME_ATTRIBUTE],
			lastName: member[LAST_NAME_ATTRIBUTE],
			phoneNumber: member[PHONE_NUMBER_ATTRIBUTE],
			creationDate: member[CREATION_DATE_ATTRIBUTE],
			jurisdiction: member[JURISDICTION_ATTRIBUTE],
			entityName: member[ENTITY_NAME_ATTRIBUTE],
			entityType: member[ENTITY_TYPE_ATTRIBUTE],
			taxId: member[TAX_ID_ATTRIBUTE],
			country: member[COUNTRY_ATTRIBUTE],
			nationality: member[NATIONALITY_ATTRIBUTE]
		};
	}

	selectFields = type =>
		type === 'individual'
			? [...commonFields, ...individualFields]
			: [...commonFields, ...corporateFields];

	handleFieldChange = name => evt => {
		let value = evt;

		if (evt && evt.target) {
			value = evt.target.value;
		}

		const stateErrors = { ...this.state.errors };
		delete stateErrors[name];
		const errors = this.validateAllAttributes([{ name, value }]);

		if (name === 'positions') {
			value = this.filterAcceptablePositions(value);
			if (!value.some(p => this.props.positionsWithEquity.includes(p))) {
				this.setState({ equity: '' });
			}
		}

		this.setState({
			[name]: value
		});
		this.setErrors({ ...stateErrors, ...errors });
	};

	setErrors(errors) {
		const hasErrors = Object.keys(errors).length > 1;
		this.setState({
			errors: { ...errors, hasErrors }
		});
	}

	validateAllAttributes(attrs) {
		const errorText = {
			email: 'Email provided is invalid',
			jurisdiction: 'Please select a jurisdiction',
			entityName: 'Please enter an entity name',
			entityType: 'Please select a entity type',
			creationDate: 'Please enter company incorporation date',
			taxId: 'Tax id provided is invalid',
			type: 'Invalid member type',
			positions: 'Please select a position',
			country: 'Please select Residency',
			nationality: 'Please select Nationality',
			firstName: 'Please enter your first Name',
			lastName: 'Please enter your last Name',
			phoneNumber: 'Invalid phone number',
			equity: 'Shares must be between 0 and 100',
			parentId: 'Invalid parent company'
		};
		if (!attrs) {
			const fields = this.selectFields(this.state.type);
			attrs = fields.map(name => ({ name, value: this.state[name] }));
		}
		const errors = attrs.reduce(
			(acc, curr) => {
				const { name, value } = curr;
				const isError = !this.isValidAttribute(name, value);
				if (isError) {
					acc[name] = errorText[name];
					acc.hasErrors = true;
				}
				return acc;
			},
			{ hasErrors: false }
		);
		return errors;
	}

	isValidAttribute(name, value) {
		const { corporateAttributeTypes, individualAttributeTypes } = this.props;

		switch (name) {
			case 'type':
				return this.validateAttributeType(value);
			case 'equity':
				return this.validateAttributeEquity(value, this.state.positions);
			case 'did':
				return this.validateAttributeDid(value);
			case 'parentId':
				return this.validateAttributeParentId(value);
			case 'positions':
				return value.length > 0;
		}

		const type =
			this.state.type === 'individual'
				? individualAttributeTypes[name]
				: corporateAttributeTypes[name];

		if (!type || !type.content) {
			throw new Error(`${name} is not a basic attribute`);
		}

		if (!value) {
			return !type.required;
		}

		return identityAttributes.validate(type.content, value, []);
	}

	validateAttributeType = type => {
		return ['individual', 'corporate'].includes(type);
	};

	validateAttributePositions = selectedPositions => {
		const acceptablePositions = this.props.availablePositions.map(p => p.position);
		let isError = false;
		if (!selectedPositions || selectedPositions.size === 0) {
			return false;
		}
		selectedPositions.forEach(p => {
			isError = isError || !acceptablePositions.includes(p);
		});
		return !isError;
	};

	validateAttributeEquity = (shares = null, selectedPositions = []) => {
		if (shares === null || shares === '') return true;
		const number = parseInt(shares);
		const positionsWithEquity = this.props.positionsWithEquity
			? this.props.positionsWithEquity
			: [];
		if (selectedPositions.some(p => positionsWithEquity.includes(p))) {
			return !isNaN(number) && number >= 0 && number <= 100;
		} else {
			return true;
		}
	};

	validateAttributeDid = did => true;

	filterAcceptablePositions = selectedPositions =>
		selectedPositions.filter(p =>
			this.props.availablePositions.map(pos => pos.position).includes(p)
		);

	validateAttributeParentId = parentId =>
		this.props.companies.find(c => c.identity.id === +parentId);

	handleContinueClick = evt => {
		evt && evt.preventDefault();

		const errors = this.validateAllAttributes();

		if (errors.hasErrors) {
			return this.setErrors(errors);
		}

		const fields = this.selectFields(this.state.type).filter(f => !!this.state[f]);

		const { profile } = this.props;

		if (!profile) {
			this.props.dispatch(
				identityOperations.createMemberProfileOperation(
					{
						..._.pick(this.state, fields),
						parentId: this.state.parentId
					},
					'/main/corporate/dashboard/members'
				)
			);
		} else {
			this.props.dispatch(
				identityOperations.updateMemberProfileOperation(
					{
						..._.pick(this.state, fields)
					},
					profile.identity.id,
					'/main/corporate/dashboard/members'
				)
			);
		}
	};

	handleCancelClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/corporate/dashboard/members'));
	};

	isDisabled() {
		return this.state.errors.hasErrors;
	}

	render() {
		const membersForm = _.pick(this.state, ['errors', ...this.selectFields(this.state.type)]);
		return (
			<CorporateMemberForm
				{...this.props}
				{...membersForm}
				isEditing={!!this.props.profile}
				selectedType={this.state.type}
				isDisabled={this.isDisabled()}
				onFieldChange={this.handleFieldChange}
				onContinueClick={this.handleContinueClick}
				onCancelClick={this.handleCancelClick}
			/>
		);
	}
}

const memberData = (state, identityId) => {
	const attributes = [
		EMAIL_ATTRIBUTE,
		FIRST_NAME_ATTRIBUTE,
		LAST_NAME_ATTRIBUTE,
		JURISDICTION_ATTRIBUTE,
		ENTITY_TYPE_ATTRIBUTE,
		TAX_ID_ATTRIBUTE,
		ENTITY_NAME_ATTRIBUTE,
		CREATION_DATE_ATTRIBUTE,
		COUNTRY_ATTRIBUTE,
		NATIONALITY_ATTRIBUTE,
		PHONE_NUMBER_ATTRIBUTE
	];

	const data = [];
	attributes.forEach(
		attr =>
			(data[attr] = identitySelectors.selectAttributeValue(state, {
				identityId,
				attributeTypeUrl: attr
			}))
	);
	return data;
};

const mapStateToProps = (state, props) => {
	let { parentId, identityId } = props.match.params;

	const profile = identityId ? identitySelectors.selectProfile(state, { identityId }) : false;
	parentId = profile && profile.identity.parentId ? profile.identity.parentId : parentId;
	const parentProfile = identitySelectors.selectCorporateProfile(state, {
		identityId: parentId
	});
	const rootProfile = identitySelectors.selectCorporateProfile(state);

	if (!parentProfile || parentProfile.identity.type !== 'corporate') {
		throw new Error(`Invalid parent identity, requires 'corporate' type`);
	}

	return {
		parentId,
		parentProfile,
		profile,
		individualAttributeTypes: identitySelectors.selectMemberIndividualAttributeTypes(state),
		corporateAttributeTypes: identitySelectors.selectMemberCorporateAttributeTypes(state),
		walletType: appSelectors.selectWalletType(state),
		countries: identitySelectors.selectCountries(state),
		jurisdictions: identitySelectors.selectCorporateJurisdictions(state),
		entityTypes: identitySelectors.selectCorporateLegalEntityTypes(state),
		availablePositions: identitySelectors.selectPositionsForCompanyType(state, {
			companyType: parentProfile.entityType
		}),
		positionsWithEquity: identitySelectors.selectEquityPositionsForCompanyType(state, {
			companyType: parentProfile.entityType
		}),
		companies: [
			rootProfile,
			...identitySelectors
				.selectChildrenProfilesByType(state, {
					identityId: rootProfile.identity.id,
					type: 'corporate'
				})
				.filter(c => c.identity.id !== +identityId)
		],
		member: identityId ? memberData(state, identityId) : false
	};
};

const styledComponent = withStyles(styles)(CorporateMemberContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as CorporateMemberContainer };
export default connectedComponent;
