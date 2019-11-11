import React, { PureComponent } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { memoizedIdentitySelectors } from 'common/identity';
import { didSelectors, didOperations } from 'common/did';
import { AssociateDid } from './associate-did';

class AssociateDIDContainerComponent extends PureComponent {
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
		this.props.dispatch(didOperations.resetAssociateDIDOperation());
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
			await this.props.dispatch(didOperations.updateDIDOperation(did));
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
		identity: memoizedIdentitySelectors.selectIdentity(state),
		associateError: didSelectors.selectAssociateError(state),
		didOriginUrl: didSelectors.selectOriginUrl(state)
	};
};

export const AssociateDIDContainer = connect(mapStateToProps)(AssociateDIDContainerComponent);

export default AssociateDIDContainer;
