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

const fields = [];

class CorporateAddMemberContainer extends PureComponent {
	state = {
		errors: { hasErrors: false }
		// TODO: validate fields
	};

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
				isDisabled={this.isDisabled()}
				onFieldChange={this.handleFieldChange}
				onContinueClick={this.handleContinueClick}
				onCancelClick={this.handleCancelClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		basicAttributeTypes: identitySelectors.selectBasicCorporateAttributeTypes(state),
		basicIdentity: identitySelectors.selectCorporateProfile(state, {
			identityId: props.match.params.identityId
		}),
		walletType: appSelectors.selectWalletType(state),
		jurisdictions: identitySelectors.selectCorporateJurisdictions(state),
		entityTypes: identitySelectors.selectCorporateLegalEntityTypes(state),
		positions: identitySelectors.selectPositionsForCompanyType(state, 'llc')
	};
};

const styledComponent = withStyles(styles)(CorporateAddMemberContainer);
export default connect(mapStateToProps)(styledComponent);
