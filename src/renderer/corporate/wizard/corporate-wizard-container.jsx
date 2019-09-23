import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { appSelectors } from 'common/app';
import { CorporateWizard } from './corporate-wizard';
import { push } from 'connected-react-router';
import { identityOperations } from 'common/identity';

class CorporateWizardContainerComponent extends Component {
	state = {
		errors: {},
		jurisdiction: null,
		taxId: null,
		entityType: null,
		email: null,
		entityName: null,
		creationDate: null
	};

	handleFieldChange = name => evt => {
		const errors = { ...this.state.errors };
		let value = evt;

		if (evt && evt.target) {
			value = evt.target.value;
		}

		if (name === 'email') {
			errors.email = value && !this.isValidEmail(value) ? 'Invalid email' : null;
		}
		this.setState({
			errors,
			[name]: value
		});
	};

	handleContinueClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(
			identityOperations.createCorporateProfileOperation(
				_.pick(
					this.state,
					'jurisdiction',
					'taxId',
					'entityType',
					'email',
					'entityName',
					'creationDate'
				)
			)
		);
	};

	handleCancelClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};

	isValidEmail = email => {
		var re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
		return email ? re.test(String(email).toLowerCase()) : true;
	};

	isDisabled() {
		return (
			!this.state.jurisdiction ||
			!this.state.entityType ||
			!this.state.entityName ||
			!this.state.creationDate ||
			(this.state.email && !this.isValidEmail(this.state.email))
		);
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
		walletType: appSelectors.selectWalletType(state)
		// members: dummyMembers
	};
};

export const CorporateWizardContainer = connect(mapStateToProps)(CorporateWizardContainerComponent);

export default CorporateWizardContainer;
