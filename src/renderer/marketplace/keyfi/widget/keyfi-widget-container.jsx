import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { kycSelectors } from 'common/kyc';
import { MarketplaceKeyFiComponent } from '../common/marketplace-keyfi-component';
import { KeyFiWidget } from './keyfi-widget';

const styles = theme => ({});

class KeyFiWidgetContainerComponent extends MarketplaceKeyFiComponent {
	render() {
		return this.props.applied ? null : (
			<KeyFiWidget
				onCredentialsClick={() => this.props.dispatch(push(`/main/marketplace/keyfi`))}
			/>
		);
	}
}

KeyFiWidgetContainerComponent.propTypes = {
	applied: PropTypes.bool
};

const mapStateToProps = (state, props) => {
	const application = kycSelectors.selectApplications(state).find(app => app.rpName === 'keyfi');
	return {
		applied: application !== null
	};
};

const styledComponent = withStyles(styles)(KeyFiWidgetContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as KeyFiWidgetContainer };
