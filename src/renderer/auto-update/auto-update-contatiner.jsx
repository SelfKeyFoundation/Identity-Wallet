import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import AutoUpdateContent from './auto-update';
import { appSelectors, appOperations } from 'common/app';
import history from 'common/store/history';

class AutoUpdateContainer extends PureComponent {
	handleDownloadInstallAction = async () => {
		await this.props.dispatch(appOperations.downloadUpdateOperation());
	};

	handleCloseAction = () => {
		history.getHistory().goBack();
	};

	render() {
		return (
			<AutoUpdateContent
				{...this.props}
				downloadInstallAction={this.handleDownloadInstallAction}
				closeAction={this.handleCloseAction}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		info: appSelectors.selectAutoUpdateInfo(state)
	};
};

export const AutoUpdate = connect(mapStateToProps)(AutoUpdateContainer);

export default AutoUpdate;
