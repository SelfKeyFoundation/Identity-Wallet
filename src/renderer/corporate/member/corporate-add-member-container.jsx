import React, { PureComponent } from 'react';
import _ from 'lodash';
import { CorporateAddMember } from './corporate-add-member';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { appSelectors } from 'common/app';
import { identityAttributes } from 'common/identity/utils';
import { identityOperations, identitySelectors } from 'common/identity';

const styles = theme => ({});

const commonFields = ['shares', 'positions', 'type', 'did'];
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

class CorporateAddMemberContainer extends PureComponent {
	state = {
		errors: { hasErrors: false },
		type: 'individual'
	};

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
			creationDate: 'Please enter company creation date',
			taxId: 'Tax id provided is invalid',
			type: 'Invalid member type',
			positions: 'Invalid position',
			country: 'Please select Residency',
			nationality: 'Please select Nationality',
			firstName: 'Please enter your first Name',
			lastName: 'Please enter your last Name',
			phoneNumber: 'Invalid phone number',
			shares: 'Shares must be between 0 and 100'
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
		const { basicCorporateAttributeTypes, basicIndividualAttributeTypes } = this.props;
		const type = basicCorporateAttributeTypes[name] || basicIndividualAttributeTypes[name];

		switch (name) {
			case 'type':
				return this.validateAttributeType(value);
			case 'shares':
				return this.validateAttributeShares(value);
			case 'did':
				return this.validateAttributeDid(value);
			case 'positions':
				return true;
		}

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
		const acceptablePositions = this.props.positions.map(p => p.position);
		let isError = false;
		if (!selectedPositions || selectedPositions.size === 0) {
			return false;
		}
		selectedPositions.forEach(p => {
			isError = isError || !acceptablePositions.includes(p);
		});
		return !isError;
	};

	validateAttributeShares = shares => {
		const number = parseInt(shares);
		return !isNaN(number) && number >= 0 && number <= 100;
	};

	validateAttributeDid = did => true;

	handleContinueClick = evt => {
		evt && evt.preventDefault();

		const errors = this.validateAllAttributes();

		if (errors.hasErrors) {
			return this.setErrors(errors);
		}

		const fields = this.selectFields(this.state.type);

		this.props.dispatch(
			identityOperations.addCorporateMemberOperation({
				..._.pick(this.state, fields),
				identityId: this.props.match.params.identityId
			})
		);
	};

	handleCancelClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};

	isDisabled() {
		return this.state.errors.hasErrors;
	}

	render() {
		const membersForm = _.pick(this.state, 'errors');
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
	const identityId = props.match.params.identityId;
	const profile = identitySelectors.selectCorporateProfile(state, { identityId });

	return {
		identityId,
		profile,
		basicCorporateAttributeTypes: identitySelectors.selectBasicCorporateAttributeTypes(state),
		basicIndividualAttributeTypes: identitySelectors.selectBasicIndividualMemberAttributeTypes(
			state
		),
		walletType: appSelectors.selectWalletType(state),
		jurisdictions: identitySelectors.selectCorporateJurisdictions(state),
		entityTypes: identitySelectors.selectCorporateLegalEntityTypes(state),
		positions: identitySelectors.selectPositionsForCompanyType(state, profile.entityType)
	};
};

const styledComponent = withStyles(styles)(CorporateAddMemberContainer);
export default connect(mapStateToProps)(styledComponent);
