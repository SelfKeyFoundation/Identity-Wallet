import React, { PureComponent } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/styles';
import CertifiersDashboardOverviewPage from './dashboard-overview-page';

const styles = theme => ({});

class CertifiersDashboardOverviewContainer extends PureComponent {
	renderDate(date) {
		if (!date) return '-';
		return moment(date).format('DD MMM YYYY');
	}

	render() {
		const {
			documents,
			requestedProcesses,
			completedRequests,
			total,
			totalRevenueInKey
		} = this.props;
		return (
			<CertifiersDashboardOverviewPage
				documents={documents}
				requestedProcesses={requestedProcesses}
				completedRequests={completedRequests}
				total={total}
				totalRevenueInKey={totalRevenueInKey}
			/>
		);
	}
}

export const CertifiersDashboardOverviewTab = withStyles(styles)(
	CertifiersDashboardOverviewContainer
);

export default CertifiersDashboardOverviewTab;
