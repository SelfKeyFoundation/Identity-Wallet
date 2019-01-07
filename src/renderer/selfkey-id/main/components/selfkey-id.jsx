import React, { Component } from 'react';
import { Grid, Typography, Tabs, Tab } from '@material-ui/core';
import SelfkeyIdOverview from './selfkey-id-overview';
import SelfkeyIdApplications from './selfkey-id-applications';
import SelfkeyIdHistory from './selfkey-id-history';

class SelfkeyId extends Component {
	state = {
		tabValue: 0
	};

	handleChange = (event, tabValue) => {
		this.setState({ tabValue });
	};

	render() {
		let component = <SelfkeyIdOverview {...this.props} />;
		if (this.state.tabValue === 1) {
			component = <SelfkeyIdApplications {...this.props} />;
		} else if (this.state.tabValue === 2) {
			component = <SelfkeyIdHistory {...this.props} />;
		}

		return (
			<Grid container direction="column" spacing={32}>
				<Grid item>
					<Typography variant="h5">SelfKey Identity Wallet</Typography>
				</Grid>
				<Grid item>
					<Tabs value={this.state.tabValue} onChange={this.handleChange}>
						<Tab label="Overview" />
						<Tab label="Marketplace Applications" />
						<Tab label="History" />
					</Tabs>
				</Grid>
				<Grid item> {component} </Grid>
			</Grid>
		);
	}
}

export default SelfkeyId;
