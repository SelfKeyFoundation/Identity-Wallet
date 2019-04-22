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
// import SelfkeyIdCompanies from './selfkey-id-companies';
// import SelfkeyIdHistory from './selfkey-id-history';

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
		showApplicationRefreshModal: false
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

		// this is needed otherwise the rp keeps loading (stuck)
		if (!this.props.incorporations || !this.props.incorporations.length) {
			this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}

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
		this.setState({ tabValue: 0 }, () => {
			this.overview.handleAddDocument();
		});
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
			// get stored application from local database
			let application = this.props.applications.find(app => {
				return app.id === id;
			});
			// get current application info from kyc
			let kycApplication = this.props.rp.applications.find(app => {
				return app.id === id;
			});

			if (application && kycApplication) {
				// update stored application
				application.currentStatus = kycApplication.currentStatus;
				application.currentStatusName = kycApplication.statusName;
				application.updatedAt = kycApplication.updatedAt;
			}

			// sync of RP applications with local database is done automatically, all done, show modal
			this.setState({
				applicationId: null,
				showApplicationRefreshModal: true
			});
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
							Application status updated successfully.
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

		let component = <SelfkeyIdOverview {...this.props} onRef={ref => (this.overview = ref)} />;

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
