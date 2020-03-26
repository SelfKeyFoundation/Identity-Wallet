import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { push } from 'connected-react-router';
import { appSelectors } from 'common/app';

class WalletExportContainer extends PureComponent {
	handleExport = () => {
		this.props.dispatch(push('/main/export-wallet/qr'));
	};

	handleCancel = () => {
		this.props.dispatch(push('/main/dashboard'));
	};

	render() {
		const { children, keystore } = this.props;

		return (
			<React.Fragment>
				{children({ onExport: this.handleExport, onCancel: this.handleCancel, keystore })}
			</React.Fragment>
		);
	}
}

WalletExportContainer.propTypes = {
	children: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
	return {
		keystore: appSelectors.selectKeystoreValue(state)
	};
};

export default connect(mapStateToProps)(WalletExportContainer);
