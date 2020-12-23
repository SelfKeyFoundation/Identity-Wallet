import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { navigationFlowSelectors, navigationFlowOperations } from 'common/navigation/flow';

export function withNavFlow(WrappedComponent, config = {}) {
	const { flowId, flowName } = config;
	class WithNavFlow extends Component {
		componentDidMount() {
			if (!this.isCorrectFlow()) {
				return;
			}

			const step = _.pick(config, ['next', 'prev', 'current']);

			if (!_.isEmpty(step)) {
				this.props.dispatch(navigationFlowOperations.setStep(step));
			}
		}

		isCorrectFlow() {
			const { id, name } = this.props.flow;
			if (!id) return false;
			if (flowId && flowId !== id) {
				return false;
			}
			if (flowName && flowName !== name) {
				return false;
			}
			return true;
		}

		handleCancel = path => {
			const { dispatch } = this.props;

			if (typeof path !== 'string') {
				path = undefined;
			}

			dispatch(navigationFlowOperations.navigateCancelOperation({ path }));
		};
		handleNext = path => {
			const { dispatch } = this.props;
			if (typeof path !== 'string') {
				path = undefined;
			}
			dispatch(navigationFlowOperations.navigateNextOperation({ path }));
		};
		handlePrev = path => {
			const { dispatch } = this.props;
			if (typeof path !== 'string') {
				path = undefined;
			}
			dispatch(navigationFlowOperations.navigatePrevOperation({ path }));
		};
		handleComplete = path => {
			const { dispatch } = this.props;
			if (typeof path !== 'string') {
				path = undefined;
			}
			dispatch(navigationFlowOperations.navigateCompleteOperation({ path }));
		};
		render() {
			let { dispatch, flow, store, ...passThroughProps } = this.props;
			return (
				<WrappedComponent
					{...passThroughProps}
					onCloseClick={this.handleCancel}
					onCancel={this.handleCancel}
					onNext={this.handleNext}
					onPrev={this.handlePrev}
					onComplete={this.handleComplete}
				/>
			);
		}
	}

	WithNavFlow.displayName = `WithNavFlow(${getDisplayName(WrappedComponent)})`;

	return connect(mapStateToProps)(WithNavFlow);
}

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function mapStateToProps(state, props) {
	return {
		flow: navigationFlowSelectors.getCurrentFlow(state) || {}
	};
}
