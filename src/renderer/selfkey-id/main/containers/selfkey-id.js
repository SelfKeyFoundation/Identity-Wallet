import React, { Component } from 'react';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import SelfkeyId from '../components/selfkey-id';
import SelfkeyIdOverview from './selfkey-id-overview';
import SelfkeyIdApplications from './selfkey-id-applications';
import { push } from 'connected-react-router';

const MARKETPLACE_ROOT_PATH = '/main/marketplace';

class SelfkeyIdContainerComponent extends Component {
	state = {
		tab: 0
	};

	async componentDidMount() {
		const { identity, dispatch } = this.props;
		const tab = this.props.tabValue;
		if (this.props.identity.type !== 'individual') {
			return this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
		if (!identity.isSetupFinished) {
			await dispatch(push('/selfkeyIdCreate'));
		}

		this.setState({ tab: tab ? parseInt(tab) : 0 });
	}

	handleTabChange = (event, tab) => this.setState({ tab });

	componentDidUpdate() {
		if (this.props.identity.type !== 'individual') {
			this.props.dispatch(identityOperations.navigateToProfileOperation());
		}
	}

	handleMarketplaceAccessClick = _ => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));

	render() {
		console.log(this.props);
		const { tab } = this.state;
		let component = (
			<SelfkeyIdOverview
				{...this.props}
				onMarketplaceAccessClick={this.handleMarketplaceAccessClick}
			/>
		);

		if (tab === 1) {
			component = (
				<SelfkeyIdApplications
					{...this.props}
					onMarketplaceAccessClick={this.handleMarketplaceAccessClick}
				/>
			);
		}
		// } else if (this.state.tabValue === 2) {
		// 	component = <SelfkeyIdCompanies {...this.props} />;
		// } else if (this.state.tabValue === 3) {
		// 	component = <SelfkeyIdHistory {...this.props} />;
		// }

		return (
			<React.Fragment>
				<SelfkeyId
					tab={tab}
					component={component}
					onTabChange={this.handleTabChange}
					{...this.props}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...identitySelectors.selectSelfkeyId(state)
	};
};
export const SelfkeyIdContainer = connect(mapStateToProps)(SelfkeyIdContainerComponent);

export default SelfkeyIdContainer;
