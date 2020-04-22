import React, { PureComponent } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/styles';
import CertifiersDashboardAnalyticsPage from './dashboard-analytics-page';

const styles = theme => ({});

class CertifiersDashboardAnalytics extends PureComponent {
	renderDate(date) {
		if (!date) return '-';
		return moment(date).format('DD MMM YYYY');
	}

	render() {
		const { documents } = this.props;
		return <CertifiersDashboardAnalyticsPage documents={documents} />;
	}
}

export const CertifiersDashboardAnalyticsTab = withStyles(styles)(CertifiersDashboardAnalytics);
export default CertifiersDashboardAnalyticsTab;
