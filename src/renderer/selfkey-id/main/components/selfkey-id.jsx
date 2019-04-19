import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid, Typography, Tabs, Tab, Button, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { push } from 'connected-react-router';
import qs from 'query-string';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import { kycSelectors, kycOperations } from 'common/kyc';
import SelfkeyIdOverview from './selfkey-id-overview';
import SelfkeyIdApplications from './selfkey-id-applications';
import { Popup } from '../../../common/popup';
import { kycSelectors, kycOperations } from 'common/kyc';
// import SelfkeyIdCompanies from './selfkey-id-companies';
// import SelfkeyIdHistory from './selfkey-id-history';

/*
const dummyApplications = [
	{
		id: '5c8a88eacb05f40134eb14a5',
		owner: 'owner',
		country: 'Singapore',
		rpName: 'incorporations',
		currentStatus: 1,
		currentStatusName: 'Documents Required',
		applicationDate: '2019-03-01T17:02:01.123Z',
		payments: {
			amount: '123',
			amountKey: '746,234,43.00 KEY',
			transactionHash: 'asdasds21312',
			transactionDate: '2019-03-01T17:02:01.123Z'
		},
		updatedAt: '2019-03-01T17:02:01.123Z'
	},
	{
		id: '2',
		owner: 'owner',
		country: 'France',
		rpName: 'incorporations',
		currentStatus: 4,
		currentStatusName: 'Documents Submitted',
		applicationDate: '2019-03-02T17:02:01.123Z',
		payments: {
			amount: '123',
			amountKey: '746,234,40.00 KEY',
			transactionHash: 'asdasds21311',
			transactionDate: '2019-03-02T17:02:01.123Z'
		},
		updatedAt: '2019-03-02T17:02:01.123Z'
	},
	{
		id: '3',
		owner: 'owner',
		country: 'Malta',
		rpName: 'incorporations',
		currentStatus: 2,
		currentStatusName: 'Approved',
		applicationDate: '2019-03-03T17:02:01.123Z',
		payments: {
			amount: '123',
			amountKey: '746,234,41.00 KEY',
			transactionHash: 'asdasds21313',
			transactionDate: '2019-03-03T17:02:01.123Z'
		},
		updatedAt: '2019-03-03T17:02:01.123Z'
	},
	{
		id: '4',
		owner: 'owner',
		country: 'Brazil',
		rpName: 'incorporations',
		currentStatus: 3,
		currentStatusName: 'Denied',
		applicationDate: '2019-04-01T17:02:01.123Z',
		payments: {
			amount: '123',
			amountKey: '746,234,44.00 KEY',
			transactionHash: 'asdasds21314',
			transactionDate: '2019-04-01T17:02:01.123Z'
		},
		updatedAt: '2019-04-01T17:02:01.123Z'
	}
];
*/

const styles = theme => ({
	loading: {
		marginTop: '5em'
	}
});

class SelfkeyIdComponent extends Component {
	state = {
		tabValue: 0,
		loading: false,
		applicationId: null,
		showApplicationRefreshModal: false,
		messageApplicationRefreshModal: null
	};

	async componentDidMount() {
		const { wallet, dispatch, rpShouldUpdate } = this.props;
		const tabValue = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).tabValue;
		const notAuthenticated = false;

		if (!wallet.isSetupFinished) {
			await dispatch(push('/selfkeyIdCreate'));
		} else {
			await this.props.dispatch(kycOperations.loadApplicationsOperation());
		}

		if (tabValue) {
			this.setState({ tabValue: parseInt(tabValue) });
		}

		// FIXME: I dont think this is needed
		/*
		if (!this.props.incorporations || !this.props.incorporations.length) {
			this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}
		*/

		if (rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', notAuthenticated)
			);
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.rp !== this.props.rp) {
			this.setState({ loading: false }, () => {
				if (this.state.applicationId) {
					// try to refresh again after loading relying party
					this.handleApplicationRefresh(this.state.applicationId);
				}
			});
		}
	}

	handleChange = (event, tabValue) => {
		this.setState({ tabValue });
	};

	handleApplicationAddDocuments = id => {
		// TODO: add documents
		console.log(id);
	};

	handleApplicationRefresh = id => {
		const { rp } = this.props;
		const afterAuthRoute = `/main/selfkeyId?tabValue=1`;
		const cancelRoute = `/main/selfkeyId?tabValue=1`;
		const authenticated = true;

		// if relying party not loaded, try again
		if (!rp || !rp.authenticated) {
			this.setState({ loading: true, applicationId: id }, async () => {
				await this.props.dispatch(
					kycOperations.loadRelyingParty(
						'incorporations',
						authenticated,
						afterAuthRoute,
						cancelRoute
					)
				);
			});
		} else {
			// FIXME: sync of RP applications with local database is done automatically
			// FIXME: check kyc/index.js line 327
			// FIXME: if you authenticate it should sync automatically
			/*
			// get stored application from local database
			let application = this.props.applications.find(app => {
				return app.id === id;
			});
			// get current application info from kyc
			let kycApplication = this.props.rp.applications.find(app => {
				return app.id === id;
			});

			let message;

			if (application && kycApplication) {
				// update stored application
				application.currentStatus = kycApplication.currentStatus;
				application.currentStatusName = kycApplication.statusName;
				application.updatedAt = kycApplication.updatedAt;

				// TODO: update local database

				message = 'Application status updated successfully.';
			} else {
				message = 'Could not update your application. Please try again later.';
			}

			// all done, show modal
			this.setState({
				showApplicationRefreshModal: true,
				messageApplicationRefreshModal: message
			});

			if (this.state.applicationId) {
				// reset id
				this.setState({ applicationId: null });
			}
			*/
		}
	};

	renderLoadingScreen = () => (
		<Grid container justify="center" alignItems="center">
			<CircularProgress size={50} className={this.props.classes.loading} />
		</Grid>
	);

	handleCloseApplicationRefreshModal = evt => {
		evt && evt.preventDefault();
		this.setState({ showApplicationRefreshModal: false });
	};

	renderApplicationRefreshModal() {
		const { classes } = this.props;
		return (
			<Popup
				open={true}
				text={'Update Application'}
				closeAction={this.handleCloseApplicationRefreshModal}
			>
				<Grid
					container
					className={classes.root}
					spacing={32}
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item>
						<Typography variant="overline">
							{this.state.messageApplicationRefreshModal}
						</Typography>
					</Grid>
					<Grid item>
						<Grid container spacing={24}>
							<Grid item>
								<Button
									variant="outlined"
									size="large"
									onClick={this.handleCloseApplicationRefreshModal}
								>
									Close
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}

	render() {
		const { isLoading } = this.props;
		const { showApplicationRefreshModal } = this.state;

		let component = <SelfkeyIdOverview {...this.props} />;

		if (this.state.tabValue === 1) {
			if (isLoading || this.state.loading) {
				return this.renderLoadingScreen();
			}
			component = (
				<SelfkeyIdApplications
					{...this.props}
					handleAddDocuments={this.handleApplicationAddDocuments}
					handleRefresh={this.handleApplicationRefresh}
				/>
			);
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
				{this.state.tabValue === 1 &&
					showApplicationRefreshModal &&
					this.renderApplicationRefreshModal()}
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	const notAuthenticated = false;
	return {
		wallet: walletSelectors.getWallet(state),
		isLoading: incorporationsSelectors.getLoading(state),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			notAuthenticated
		),
		applications: kycSelectors.selectApplications(state)
	};
};

export const SelfkeyId = connect(mapStateToProps)(withStyles(styles)(SelfkeyIdComponent));

export default SelfkeyId;
