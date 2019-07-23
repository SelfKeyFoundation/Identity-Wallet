import React, { Component } from 'react';
import { Grid, Typography, Tabs, Tab } from '@material-ui/core';
import { push } from 'connected-react-router';
import SelfkeyIdOverview from './selfkey-id-overview';
import SelfkeyIdApplications from './selfkey-id-applications';
// import SelfkeyIdCompanies from './selfkey-id-companies';
// import SelfkeyIdHistory from './selfkey-id-history';

class SelfkeyIdComponent extends Component {
	state = {
		tabValue: 0
	};

	async componentDidMount() {
		const { wallet, dispatch } = this.props;
		const tabValue = this.props.tabValue;
		if (!wallet.isSetupFinished) {
			await dispatch(push('/selfkeyIdCreate'));
		}
		if (tabValue) {
			this.setState({ tabValue: parseInt(tabValue) });
		} else {
			this.setState({ tabValue: 0 });
		}
	}

	handleChange = (event, tabValue) => {
		this.setState({ tabValue });
	};

	render() {
		let component = <SelfkeyIdOverview {...this.props} onRef={ref => (this.overview = ref)} />;

		if (this.state.tabValue === 1) {
			component = <SelfkeyIdApplications {...this.props} />;
		}
		// } else if (this.state.tabValue === 2) {
		// 	component = <SelfkeyIdCompanies {...this.props} />;
		// } else if (this.state.tabValue === 3) {
		// 	component = <SelfkeyIdHistory {...this.props} />;
		// }

		return (
			<Grid container direction="column" spacing={32}>
				<Grid item>
					<Typography variant="h1">SelfKey Identity Wallet</Typography>
				</Grid>
				<Grid item>
					<Tabs value={this.state.tabValue} onChange={this.handleChange}>
						<Tab label="Overview" />
						<Tab label="Marketplace Applications" />
						{/* <Tab label="Companies" /> */}
						{/* <Tab label="History" /> */}
					</Tabs>
				</Grid>
				<Grid item>{component}</Grid>
			</Grid>
		);
	}
}

export const SelfkeyId = SelfkeyIdComponent;

export default SelfkeyId;
