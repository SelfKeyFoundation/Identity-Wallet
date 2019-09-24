import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { appSelectors } from 'common/app';
import { CorporateWizard } from './corporate-wizard';
import { push } from 'connected-react-router';
import { identityOperations, identitySelectors } from 'common/identity';

class CorporateWizardContainerComponent extends Component {
	constructor(props) {
		super(props);
		const { basicIdentity = {} } = props;
		this.state = {
			errors: {},
			jurisdiction: basicIdentity.jurisdiction || '',
			taxId: basicIdentity.taxId || null,
			entityType: basicIdentity.entityType || '',
			email: basicIdentity.email || null,
			entityName: basicIdentity.entityName || null,
			creationDate: basicIdentity.creationDate || null
		};
	}

	componentDidMount() {
		if (this.props.identity.type !== 'corporate') {
			this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
	}

	componentDidUpdate() {
		if (this.props.identity.type !== 'corporate') {
			this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
	}

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
			identityOperations.createCorporateProfileOperation({
				..._.pick(
					this.state,
					'jurisdiction',
					'taxId',
					'entityType',
					'email',
					'entityName',
					'creationDate'
				),
				identityId: this.props.match.params.identityId
			})
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
