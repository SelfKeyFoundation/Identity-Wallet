import React, { Component } from 'react';
import config from 'common/config';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import { kycSelectors, kycOperations, kycActions } from 'common/kyc';
import { appSelectors } from 'common/app';
import SelfkeyIdApplications from '../components/selfkey-id-applications';

class SelfkeyIdApplicationsContainerComponent extends Component {
	state = {
		loading: false,
		applicationId: null,
		addingDocuments: false,
		rpName: null,
		refreshing: false,
		showApplicationRefreshModal: false
	};

	async componentDidMount() {
		const { rp, afterAuthRoute } = this.props;
		const cancelRoute = `/main/selfkeyId`;
		const authenticate = true;

		await this.props.dispatch(kycOperations.resetApplications());
		// if relying party not loaded, try again
		if (!rp || !rp.authenticated) {
			this.setState({ loading: true }, async () => {
				await this.props.dispatch(kycOperations.setProcessing(true));
				await this.props.dispatch(
					kycOperations.loadRelyingParty(
						'incorporations',
						authenticate,
						afterAuthRoute,
						cancelRoute
					)
				);
			});
		}

		// try to load existing kyc_applications data
		await this.props.dispatch(kycOperations.loadApplicationsOperation());

		// this is needed otherwise the rp keeps loading (stuck)
		if (!this.props.incorporations || !this.props.incorporations.length) {
			await this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.rp !== this.props.rp) {
			if (this.props.rp.authenticated) {
				await this.props.dispatch(kycOperations.loadApplicationsOperation());
			}
			this.setState({ loading: false }, () => {
				if (this.state.refreshing) {
					if (this.state.applicationId) {
						// try to refresh again after loading relying party
						this.handleApplicationRefresh(this.state.applicationId);
					}
				}
				if (this.state.addingDocuments) {
					if (this.state.applicationId) {
						// try to refresh again after loading relying party
						this.handleApplicationAddDocuments(
							this.state.applicationId,
							this.state.rpName
						);
					}
				}
			});
		}
	}

	handleApplicationAddDocuments = (id, rpName) => {
		const { rp, afterAuthRoute } = this.props;
		const cancelRoute = `/main/selfkeyId`;
		const authenticate = true;

		// if relying party not loaded, try again
		if (!rp || !rp.authenticated) {
			this.setState(
				{ loading: true, addingDocuments: true, applicationId: id, rpName },
				async () => {
					await this.props.dispatch(
						kycOperations.loadRelyingParty(
							'incorporations',
							authenticate,
							afterAuthRoute,
							cancelRoute
						)
					);
				}
			);
		} else {
			let self = this;
			this.setState(
				{
					loading: false,
					addingDocuments: false,
					applicationId: null,
					rpName: null
				},
				async () => {
					// Get current application info from kyc
					let currentApplication = self.props.rp.applications.find(app => {
						return app.id === id;
					});
					// get stored application from local database
					let application = this.props.applications.find(app => {
						return app.id === id;
					});
					const {
						template,
						vendor,
						privacyPolicy,
						termsOfService,
						attributes
					} = currentApplication;
					const { rpName, title } = application;
					/* eslint-disable camelcase */
					const description = application.sub_title;
					/* eslint-enable camelcase */
					const agreement = true;

					// Set application data
					await self.props.dispatch(
						kycActions.setCurrentApplication(
							rpName,
							template,
							afterAuthRoute,
							cancelRoute,
							title,
							description,
							agreement,
							vendor,
							privacyPolicy,
							termsOfService,
							attributes
						)
					);

					// Open add documents modal
					// (Later on, we will need to improve this to be able to distinguish requirements
					// that can be fulfilled by the wallet and ones that need redirect to KYCC.)
					//
					// await self.props.dispatch(
					// 	kycOperations.loadRelyingParty(
					// 		rpName,
					// 		true,
					// 		`/main/kyc/current-application/${rpName}?applicationId=${id}`
					// 	)
					// );

					// Redirects to KYCC chain on an external browser window with auto-login
					const instanceUrl = self.props.rp.session.ctx.config.rootEndpoint;
					const url = `${instanceUrl}/applications/${application.id}?access_token=${
						self.props.rp.session.access_token.jwt
					}`;
					window.openExternal(null, url);
				}
			);
		}
	};

	handleApplicationRefresh = id => {
		const { afterAuthRoute } = this.props;
		const cancelRoute = `/main/selfkeyId`;
		const authenticate = true;

		// if relying party not loaded, try again
		if (!this.state.refreshing) {
			this.setState({ loading: true, refreshing: true, applicationId: id }, async () => {
				await this.props.dispatch(
					kycOperations.loadRelyingParty(
						'incorporations',
						authenticate,
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
				refreshing: false,
				applicationId: null,
				showApplicationRefreshModal: true
			});
		}
	};

	handleCloseApplicationRefreshModal = evt => {
		evt && evt.preventDefault();
		this.setState({ showApplicationRefreshModal: false });
	};

	render() {
		const { isLoading, processing } = this.props;
		let loading = isLoading || processing || this.state.loading;
		return (
			<SelfkeyIdApplications
				{...this.props}
				config={config}
				loading={loading}
				showApplicationRefreshModal={this.state.showApplicationRefreshModal}
				onCloseApplicationRefreshModal={this.handleCloseApplicationRefreshModal}
				onApplicationRefresh={this.handleApplicationRefresh}
				onApplicationAddDocuments={this.handleApplicationAddDocuments}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const notAuthenticated = false;
	const walletType = appSelectors.selectApp(state).walletType;
	const afterAuthRoute =
		walletType === 'ledger' || walletType === 'trezor' ? `/main/selfkeyIdApplications` : '';
	return {
		wallet: walletSelectors.getWallet(state),
		isLoading: incorporationsSelectors.getLoading(state),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			notAuthenticated
		),
		applications: kycSelectors.selectApplications(state),
		processing: kycSelectors.selectProcessing(state),
		afterAuthRoute
	};
};
export const SelfkeyIdApplicationsContainer = connect(mapStateToProps)(
	SelfkeyIdApplicationsContainerComponent
);

export default SelfkeyIdApplicationsContainer;
