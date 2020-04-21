import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { kycSelectors, kycOperations } from '../../../common/kyc';
import { CurrentApplicationPopup } from './current-application-popup';
import { CreateAttributeContainer, EditAttributeContainer } from '../../attributes';
import { jsonSchema } from 'common/identity/utils';
import { push } from 'connected-react-router';
import qs from 'query-string';

class CurrentApplicationComponent extends PureComponent {
	state = {
		selected: {},
		showCreateAttribute: false,
		showEditAttribute: false,
		agreementError: false,
		agreementValue: false,
		editAttribute: {},
		typeId: -1,
		isDocument: false
	};
	componentDidMount() {
		if (!this.props.currentApplication) return;

		const authenticated = true;
		if (this.props.rpShouldUpdate) {
			this.props.dispatch(
				kycOperations.loadRelyingParty(
					this.props.currentApplication.relyingPartyName,
					authenticated,
					`/main/kyc/current-application/${
						this.props.currentApplication.relyingPartyName
					}`
				)
			);
		}
	}
	handleAgreementChange = agreementValue => {
		this.setState({ agreementValue });
	};
	handleSubmit = async () => {
		const { currentApplication, requirements } = this.props;
		const { agreementValue, selected } = this.state;
		if (currentApplication.agreement && !agreementValue) {
			this.setState({ agreementError: true });
			return;
		}
		const error = requirements.reduce((acc, curr) => {
			if (acc) return acc;

			const attribute = selected[curr.uiId] || curr.options[0];
			// Ignore optional empty attributes
			if (!attribute && !curr.required) {
				return false;
			}

			if (!curr.options || !curr.options.length) return true;
			if (!attribute || !attribute.isValid) return true;
			return false;
		}, false);

		if (error) {
			this.setState({ error });
			return;
		}
		if (this.props.existingApplicationId) {
			this.props.dispatch(push('/main/selfkeyIdApplications'));
		} else {
			await this.props.dispatch(
				kycOperations.submitCurrentApplicationOperation(this.state.selected)
			);
		}
	};
	handleClose = () => {
		if (this.props.existingApplicationId) {
			this.props.dispatch(push('/main/selfkeyIdApplications'));
		} else {
			this.props.dispatch(kycOperations.cancelCurrentApplicationOperation());
		}
	};
	handleSelected = (uiId, item) => {
		const { selected } = this.state;
		if (selected[uiId] === item) return;
		this.setState({ selected: { ...selected, [uiId]: item } });
	};
	handleEdit = item => {
		this.setState({
			showEditAttribute: true,
			editAttribute: this.state.selected[item.id] || item.options[0]
		});
	};
	handleAdd = (item, identityId) => {
		this.setState({
			showCreateAttribute: true,
			typeId: item.type.id,
			identityId,
			isDocument: jsonSchema.containsFile(item.type.content)
		});
	};
	handlePopupClose = () => {
		this.setState({ showEditAttribute: false, showCreateAttribute: false });
	};
	render() {
		const {
			userData,
			currentApplication,
			relyingParty,
			requirements,
			existingApplicationId,
			memberRequirements
		} = this.props;
		return (
			<div>
				<CurrentApplicationPopup
					userData={userData}
					currentApplication={currentApplication}
					agreement={currentApplication.agreement}
					vendor={currentApplication.vendor}
					privacyPolicy={currentApplication.privacyPolicy}
					termsOfService={currentApplication.termsOfService}
					agreementValue={this.state.agreementValue}
					agreementError={this.state.agreementError}
					onAgreementChange={this.handleAgreementChange}
					error={this.state.error}
					relyingParty={relyingParty}
					requirements={requirements}
					memberRequirements={memberRequirements}
					onClose={this.handleClose}
					onSubmit={this.handleSubmit}
					selectedAttributes={this.state.selected}
					onSelected={this.handleSelected}
					editItem={this.handleEdit}
					addItem={this.handleAdd}
					existingApplicationId={existingApplicationId}
				/>
				{this.state.showCreateAttribute && (
					<CreateAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						typeId={this.state.typeId}
						identityId={this.state.identityId}
						isDocument={this.state.isDocument}
					/>
				)}
				{this.state.showEditAttribute && (
					<EditAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						attribute={this.state.editAttribute}
					/>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const currentApplication = kycSelectors.selectCurrentApplication(state);
	if (!currentApplication) return {};
	const relyingPartyName = props.match.params.rpName;
	const authenticated = true;
	const existingApplicationId =
		qs.parse(props.location.search, { ignoreQueryPrefix: true }).applicationId || undefined;
	return {
		userData: kycSelectors.selectKYCUserData(state),
		relyingParty: kycSelectors.relyingPartySelector(state, relyingPartyName),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			relyingPartyName,
			authenticated
		),
		currentApplication,
		requirements: kycSelectors.selectRequirementsForTemplate(
			state,
			relyingPartyName,
			currentApplication.templateId
		),
		memberRequirements: kycSelectors.selectMemberRequirementsForTemplate(
			state,
			relyingPartyName,
			currentApplication.templateId
		),
		existingApplicationId
	};
};

export const CurrentApplication = connect(mapStateToProps)(CurrentApplicationComponent);

export default CurrentApplication;
