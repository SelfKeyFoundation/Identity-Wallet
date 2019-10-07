import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { appSelectors } from 'common/app';
import { CorporateWizard } from './corporate-wizard';
import { push } from 'connected-react-router';
import { identityAttributes } from 'common/identity/utils';
import { identityOperations, identitySelectors } from 'common/identity';

const fields = ['jurisdiction', 'taxId', 'entityType', 'email', 'entityName', 'creationDate'];

class CorporateWizardContainerComponent extends Component {
	constructor(props) {
		super(props);
		const { basicIdentity = {} } = props;
		this.state = {
			errors: { hasErrors: false },
			jurisdiction: basicIdentity.jurisdiction || '',
			taxId: basicIdentity.taxId || null,
			entityType: basicIdentity.entityType || '',
			email: basicIdentity.email || null,
			entityName: basicIdentity.entityName || null,
			creationDate: basicIdentity.creationDate || null
		};
	}

	componentDidMount() {
		if (this.props.identity && this.props.identity.type !== 'corporate') {
			this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
	}

	componentDidUpdate() {
		if (this.props.identity && this.props.identity.type !== 'corporate') {
			this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
	}

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
			taxId: 'Tax id provided is invalid'
		};
		if (!attrs) {
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
		const { basicAttributeTypes } = this.props;
		const type = basicAttributeTypes[name];
		if (!type || !type.content) {
			throw new Error('Not a basic attribute');
		}

		if (!value) {
			return !type.required;
		}

		return identityAttributes.validate(type.content, value, []);
	}

	handleContinueClick = evt => {
		evt && evt.preventDefault();

		const errors = this.validateAllAttributes();

		if (errors.hasErrors) {
			return this.setErrors(errors);
		}

		this.props.dispatch(
			identityOperations.createCorporateProfileOperation({
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
		const companyForm = _.pick(
			this.state,
			'errors',
			'jurisdiction',
			'taxId',
			'entityType',
			'email',
			'entityName',
			'creationDate'
		);
		return (
			<CorporateWizard
				{...this.props}
				{...companyForm}
				isDisabled={this.isDisabled()}
				onFieldChange={this.handleFieldChange}
				onContinueClick={this.handleContinueClick}
				onCancelClick={this.handleCancelClick}
			/>
		);
	}
}

// const dummyMembers = [
// 	{
// 		id: '1',
// 		name: 'Giacomo Guilizzoni',
// 		type: 'Person',
// 		role: 'Director, Shareholder',
// 		citizenship: 'Italy',
// 		residency: 'Singapore',
// 		shares: '45%'
// 	},
// 	{
// 		id: '2',
// 		name: 'Marco Botton Ltd',
// 		type: 'Corporate',
// 		role: 'Shareholder',
// 		citizenship: 'Hong Kong',
// 		residency: 'Hong Kong',
// 		shares: '9%'
// 	},
// 	{
// 		id: '3',
// 		name: 'Big Things Ltd',
// 		type: 'Corporate',
// 		role: 'Shareholder',
// 		citizenship: 'Hong Kong',
// 		residency: 'Hong Kong',
// 		shares: '41%'
// 	},
// 	{
// 		id: '4',
// 		name: 'John Dafoe',
// 		type: 'Person',
// 		role: 'Director',
// 		citizenship: 'France',
// 		residency: 'France',
// 		shares: '5%'
// 	}
// ];

const mapStateToProps = (state, props) => {
	return {
		basicAttributeTypes: identitySelectors.selectBasicCorporateAttributeTypes(state),
		basicIdentity: identitySelectors.selectCorporateProfile(
			state,
			props.match.params.identityId
		),
		walletType: appSelectors.selectWalletType(state),
		jurisdictions: identitySelectors.selectCorporateJurisdictions(state),
		entityTypes: identitySelectors.selectCorporateLegalEntityTypes(state)
		// members: dummyMembers
	};
};

export const CorporateWizardContainer = connect(mapStateToProps)(CorporateWizardContainerComponent);

export default CorporateWizardContainer;
