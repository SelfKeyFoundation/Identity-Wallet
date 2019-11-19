import React, { PureComponent } from 'react';
import _ from 'lodash';
import { CorporateAddMember } from './corporate-add-member';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { appSelectors } from 'common/app';
import { identityAttributes } from 'common/identity/utils';
import { identityOperations, identitySelectors } from 'common/identity';
import { getProfileIdAttribute } from '../common/common-helpers.jsx';
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

class CorporateEditMemberContainerComponent extends PureComponent {
	constructor(props) {
		super(props);

		const { profile } = this.props;
		this.state = {
			errors: { hasErrors: false },
			type: profile.identity.type || 'individual',
			parentId: props.companies[0].identity.id,
			email: getProfileIdAttribute(profile, EMAIL_ATTRIBUTE),
			firstName: getProfileIdAttribute(profile, FIRST_NAME_ATTRIBUTE),
			lastName: getProfileIdAttribute(profile, LAST_NAME_ATTRIBUTE),
			phoneNumber: getProfileIdAttribute(profile, PHONE_NUMBER_ATTRIBUTE),
			creationDate: getProfileIdAttribute(profile, CREATION_DATE_ATTRIBUTE),
			jurisdiction: getProfileIdAttribute(profile, JURISDICTION_ATTRIBUTE),
			entityName: getProfileIdAttribute(profile, ENTITY_NAME_ATTRIBUTE),
			entityType: getProfileIdAttribute(profile, ENTITY_TYPE_ATTRIBUTE),
			taxId: getProfileIdAttribute(profile, TAX_ID_ATTRIBUTE),
			country: getProfileIdAttribute(profile, COUNTRY_ATTRIBUTE),
			nationality: getProfileIdAttribute(profile, NATIONALITY_ATTRIBUTE),
			equity: profile.identity.equity,
			positions: new Set(profile.identity.positions),
			did: profile.identity.did
		};

		console.log(new Set(profile.identity.positions));
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

		console.log(value);

		if (name === 'positions' && value) {
			value = this.filterAcceptablePositions(Array.from(value));
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
			positions: 'Invalid position',
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
				return this.validateAttributeEquity(value);
			case 'did':
				return this.validateAttributeDid(value);
			case 'parentId':
				return this.validateAttributeParentId(value);
			case 'positions':
				return true;
		}

		const type = corporateAttributeTypes[name] || individualAttributeTypes[name];

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

	validateAttributeEquity = (shares = null) => {
		if (shares === null) return true;

		const number = parseInt(shares);
		return !isNaN(number) && number >= 0 && number <= 100;
	};

	validateAttributeDid = did => true;

	filterAcceptablePositions = selectedPositions =>
		selectedPositions.filter(p =>
			this.props.availablePositions.map(pos => pos.position).includes(p)
		);

	validateAttributeParentId = parentId =>
		this.props.companies.find(c => c.identity.id === parentId);

	handleContinueClick = evt => {
		evt && evt.preventDefault();

		const errors = this.validateAllAttributes();

		if (errors.hasErrors) {
			return this.setErrors(errors);
		}

		const fields = this.selectFields(this.state.type);

		const { parentId } = this.props;

		this.props.dispatch(
			identityOperations.createMemberProfileOperation({
				..._.pick(this.state, fields),
				parentId
			})
		);
	};

	handleCancelClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/corporate'));
	};

	isDisabled() {
		return this.state.errors.hasErrors;
	}

	render() {
		const membersForm = _.pick(this.state, 'errors', this.selectFields(this.state.type));
		return (
			<CorporateAddMember
				{...this.props}
				{...membersForm}
				selectedType={this.state.type}
				isDisabled={this.isDisabled()}
				onFieldChange={this.handleFieldChange}
				onContinueClick={this.handleContinueClick}
				onCancelClick={this.handleCancelClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	let { parentId, identityId } = props.match.params;

	const profile = identitySelectors.selectProfile(state, { identityId });
	const parentProfile = identitySelectors.selectCorporateProfile(state, {
		identityId: parentId
	});

	if (!parentProfile || parentProfile.identity.type !== 'corporate') {
		throw new Error(`Invalid parent identity, requires 'corporate' type`);
	}

	console.log(profile);

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
		companies: [
			parentProfile,
			...parentProfile.members.filter(m => m.identity.type === 'corporate')
		]
	};
};

const styledComponent = withStyles(styles)(CorporateEditMemberContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as CorporateEditMemberContainer };
export default connectedComponent;
