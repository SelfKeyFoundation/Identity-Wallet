import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { didSelectors, didOperations } from 'common/did';

export function withDID(WrappedComponent, config) {
	config = config || {};
	class WithDID extends PureComponent {
		handleRegisterDidClick = _ =>
			this.props.dispatch(
				didOperations.startCreateDidFlowOperation(
					this.props.returnPath || config.returnPath || window.location.href
				)
			);
		handleAssociateDidClick = _ =>
			this.props.dispatch(
				didOperations.startAssociateDidFlowOperation(
					this.props.returnPath || config.returnPath || window.location.href
				)
			);
		render() {
			const wrappedProps = {
				...this.props,
				onRegisterDidClick: this.handleRegisterDidClick,
				onAssociateDidClick: this.handleAssociateDidClick
			};
			return (
				<React.Fragment>
					<WrappedComponent {...wrappedProps} />
				</React.Fragment>
			);
		}
	}
	WithDID.displayName = `WithDID(${getDisplayName(WrappedComponent)})`;

	WithDID.propTypes = {
		didPending: PropTypes.bool,
		did: PropTypes.string
	};

	WithDID.defaultProps = {
		didPending: false,
		did: null
	};

	return connect(mapStateToProps)(WithDID);
}

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function mapStateToProps(state, props) {
	return {
		didPending: didSelectors.isCurrentIdentityPending(state),
		did: didSelectors.selectCurrentDID(state)
	};
}
