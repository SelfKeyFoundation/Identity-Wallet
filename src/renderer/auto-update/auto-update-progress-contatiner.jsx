import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import AutoUpdateProgressContent from './auto-update-progress';
import { appSelectors, appOperations } from 'common/app';
import history from 'common/store/history';

class AutoUpdateProgressContainer extends PureComponent {
	handleInstallRelaunchAction = () => {
		this.props.dispatch(appOperations.installUpdateOperation());
	};

	handleCloseAction = () => {
		history.getHistory().goBack();
	};

	render() {
		return (
			<AutoUpdateProgressContent
				{...this.props}
				installRelaunchAction={this.handleInstallRelaunchAction}
				closeAction={this.handleCloseAction}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		progress: appSelectors.selectAutoUpdateProgress(state),
		downloaded: appSelectors.selectAutoUpdateDownloaded(state)
	};
};

export const AutoUpdate = connect(mapStateToProps)(AutoUpdateProgressContainer);

export default AutoUpdate;
