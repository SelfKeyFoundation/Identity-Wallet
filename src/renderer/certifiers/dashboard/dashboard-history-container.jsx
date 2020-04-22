import React, { PureComponent } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/styles';
import CertifiersDashboardHistoryPage from './dashboard-history-page';

const styles = theme => ({});

class CertifiersDashboardHistory extends PureComponent {
	renderDate(date) {
		if (!date) return '-';
		return moment(date).format('DD MMM YYYY');
	}

	render() {
		const { documents } = this.props;
		return <CertifiersDashboardHistoryPage documents={documents} />;
	}
}

export const CertifiersDashboardHistoryTab = withStyles(styles)(CertifiersDashboardHistory);
export default CertifiersDashboardHistoryTab;
