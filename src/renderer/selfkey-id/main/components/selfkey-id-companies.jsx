import React from 'react';
import {
	CardHeader,
	Card,
	CardContent,
	Table,
	TableBody,
	Typography,
	ExpansionPanel,
	ExpansionPanelSummary,
	Grid,
	Divider,
	ExpansionPanelDetails,
	List,
	ListItem,
	Button
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const SelfkeyIdCompanies = () => (
	<React.Fragment>
		<Typography variant="body1" color="secondary" gutterBottom>
			Pending Corporate Association
		</Typography>
		<ExpansionPanel defaultExpanded={true}>
			<ExpansionPanelSummary expandIcon={<ExpandLessIcon />}>
				<Grid container direction="row" justify="flex-start" alignItems="baseline">
					<Typography variant="h2">Trust Fund Ltd.</Typography>
				</Grid>
			</ExpansionPanelSummary>
			<Divider />

			<ExpansionPanelDetails>
				<br />
				<Grid container spacing={4}>
					<Grid item xs>
						<Card>
							<CardHeader title="Company Details" />
							<CardContent>
								<List>
									{['Binance', 'KuCoin', 'IDEX'].map(item => (
										<ListItem key={item}>
											<Typography
												variant="body2"
												color="secondary"
												gutterBottom
											>
												Definition Title 16px
											</Typography>
											<Typography variant="body2" align="right" gutterBottom>
												{item}
											</Typography>
										</ListItem>
									))}
								</List>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs>
						<Card>
							<CardHeader title="Your Information" />
							<CardContent>
								<List>
									{['Binance', 'KuCoin', 'IDEX'].map(item => (
										<ListItem key={item}>
											<Typography
												variant="body2"
												color="secondary"
												gutterBottom
											>
												Definition Title 16px
											</Typography>
											<Typography variant="body2" align="right" gutterBottom>
												{item}
											</Typography>
										</ListItem>
									))}
								</List>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs justify="flex-end">
						<Button variant="contained" size="large">
							Accept Invitation
						</Button>
					</Grid>
				</Grid>
			</ExpansionPanelDetails>
		</ExpansionPanel>
		<br />

		<Typography variant="body1" color="secondary" gutterBottom>
			Your Companies
		</Typography>
		<ExpansionPanel>
			<ExpansionPanelSummary expandIcon={<ExpandLessIcon />}>
				<Grid container direction="row" justify="flex-start" alignItems="baseline">
					<Typography variant="h2">Trust Fund Ltd.</Typography>
				</Grid>
			</ExpansionPanelSummary>
			<Divider />

			<ExpansionPanelDetails>
				<br />
				<Grid container spacing={4}>
					<Grid item xs>
						<Card>
							<CardHeader title="Company Details" />
							<CardContent>
								<List>
									{['Binance', 'KuCoin', 'IDEX'].map(item => (
										<ListItem key={item}>
											<Typography
												variant="body2"
												color="secondary"
												gutterBottom
											>
												Definition Title 16px
											</Typography>
											<Typography variant="body2" align="right" gutterBottom>
												{item}
											</Typography>
										</ListItem>
									))}
								</List>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs>
						<Card>
							<CardHeader title="Your Information" />
							<CardContent>
								<List>
									{['Binance', 'KuCoin', 'IDEX'].map(item => (
										<ListItem key={item}>
											<Typography
												variant="body2"
												color="secondary"
												gutterBottom
											>
												Definition Title 16px
											</Typography>
											<Typography variant="body2" align="right" gutterBottom>
												{item}
											</Typography>
										</ListItem>
									))}
								</List>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs justify="flex-end">
						<Button variant="contained" size="large">
							Accept Invitation
						</Button>
					</Grid>
				</Grid>
			</ExpansionPanelDetails>
		</ExpansionPanel>

		<Card>
			<CardHeader title="Companies" />
			<CardContent>
				<Table>
					<TableBody />
				</Table>
			</CardContent>
		</Card>
	</React.Fragment>
);

export default SelfkeyIdCompanies;
