import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { walletOperations, walletSelectors } from 'common/wallet';
import { identitySelectors } from 'common/identity';

import { AssociateDid } from './associate-did';

class AssociateDIDContainerComponent extends Component {
	state = {
		did: '',
		searching: false
	};

	componentDidMount() {
		this.resetErrors();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.associateError !== this.props.associateError) {
			if (this.state.searching) {
				if (this.props.associateError === 'none') {
					this.handleCancelClick();
				}
				this.setState({ searching: false });
			}
		}
	}

	resetErrors = () => {
		this.props.dispatch(walletOperations.resetAssociateDID());
	};

	handleCancelClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push(this.props.didOriginUrl));
	};

	handleFieldChange = async event => {
		let value = event.target.value;
		await this.resetErrors();
		this.setState({ did: value });
	};

	associateDID = async () => {
		await this.resetErrors();
		let did = this.state.did;
		if (did !== '') {
			await this.props.dispatch(
				walletOperations.updateWalletDID(this.props.identity.walletId, did)
			);
		} else {
			this.setState({ searching: false });
		}
	};

	handleAssociateDidClick = () => {
		this.setState({ searching: true }, async () => {
			await this.associateDID();
		});
	};

	render() {
		const { associateError } = this.props;
		const { did, searching } = this.state;

		return (
			<AssociateDid
				searching={searching}
				associateError={associateError}
				did={did}
				onFieldChange={this.handleFieldChange}
				onAssociateDidClick={this.handleAssociateDidClick}
				onCancelClick={this.handleCancelClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		identity: identitySelectors.selectCurrentIdentity(state),
		associateError: walletSelectors.getAssociateError(state),
		didOriginUrl: walletSelectors.getDidOriginUrl(state)
	};
};

export const AssociateDIDContainer = connect(mapStateToProps)(AssociateDIDContainerComponent);

export default AssociateDIDContainer;
