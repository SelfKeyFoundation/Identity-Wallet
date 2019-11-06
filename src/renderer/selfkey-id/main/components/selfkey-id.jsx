import React, { PureComponent } from 'react';
import { Grid, Typography, Tabs, Tab } from '@material-ui/core';

class SelfkeyIdComponent extends PureComponent {
	render() {
		return (
			<Grid container direction="column" spacing={32}>
				<Grid item>
					<Typography variant="h1">SelfKey Identity Wallet</Typography>
				</Grid>
				<Grid item>
					<Tabs value={this.props.tab} onChange={this.props.onTabChange}>
						<Tab label="Overview" />
						<Tab label="Marketplace Applications" />
						{/* <Tab label="Companies" /> */}
						{/* <Tab label="History" /> */}
					</Tabs>
				</Grid>
				<Grid item>{this.props.component}</Grid>
			</Grid>
		);
	}
}

export const SelfkeyId = SelfkeyIdComponent;

export default SelfkeyId;
