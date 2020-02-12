import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { push } from 'connected-react-router';

class WalletExportContainer extends PureComponent {
	async componentDidMount() {
		// load export file
	}

	handleExport = () => {
		this.props.dispatch(push('/main/export-wallet/qr'));
	};

	handleCancel = () => {
		this.props.dispatch(push('/main/dashboard'));
	};

	render() {
		const { children } = this.props;

		return (
			<React.Fragment>
				{children({ onExport: this.handleExport, onCancel: this.handleCancel })}
			</React.Fragment>
		);
	}
}

WalletExportContainer.propTypes = {
	children: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(WalletExportContainer);
