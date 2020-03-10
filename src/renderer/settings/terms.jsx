import React, { PureComponent } from 'react';
import {
	Grid,
	Typography,
	Paper,
	Modal,
	List,
	Link,
	ListItem,
	Button,
	Checkbox,
	FormControlLabel
} from '@material-ui/core';
import { SelfkeyLogo, ModalWrap, ModalHeader, ModalBody } from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { appOperations } from 'common/app';
import { push } from 'connected-react-router';

const styles = theme => ({
	logo: {
		width: '50px',
		height: '65px'
	},
	container: {
		minHeight: '100vh'
	},
	parentGrid: {
		minHeight: '100vh'
	},
	passwordIcon: {
		width: '66px',
		height: '76px'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent',
		boxShadow: 'none'
	},
	logoSection: {
		paddingBottom: '50px'
	},
	flexSection: {
		flexGrow: 1,
		display: 'flex',
		flexDirection: 'column',
		minHeight: 0
	},
	flexColScroll: {
		flexGrow: 1,
		overflow: 'auto',
		maxHeight: '300px'
	},
	paper: {
		boxShadow: '0 7px 15px 0 rgba(0, 0, 0, 0.2)'
	}
});

class Terms extends PureComponent {
	state = {
		crashReportAgreement: true
	};

	handleAgree = () => {
		this.props.dispatch(
			appOperations.setTermsAcceptedOperation(true, this.state.crashReportAgreement)
		);
	};

	handleDisagree = () => {
		this.props.dispatch(push('/termsWarning'));
	};

	toogleCrashReportAgreement = () => {
		this.setState({ crashReportAgreement: !this.state.crashReportAgreement });
	};

	render() {
		const { classes } = this.props;
		return (
			<Modal open={true}>
				<ModalWrap className={classes.modalWrap}>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="center"
						spacing={8}
						className={classes.logoSection}
					>
						<Grid item>
							<SelfkeyLogo className={classes.logo} />
						</Grid>
						<Grid item>
							<Typography variant="h1">SELFKEY</Typography>
						</Grid>
					</Grid>
					<Paper className={classes.paper}>
						<ModalHeader>
							<Typography variant="h3" id="modal-title">
								Terms of Service Agreement
							</Typography>
						</ModalHeader>

						<ModalBody>
							<Grid
								container
								direction="column"
								justify="flex-start"
								alignItems="flex-start"
								className={classes.flexSection}
								spacing={40}
							>
								<Grid id="terms" item className={classes.flexColScroll}>
									<Typography variant="h3" paragraph>
										1) ACCEPTANCE OF TERMS
									</Typography>
									<Typography variant="body2" paragraph>
										SelfKey Foundation
									</Typography>
									<Typography variant="body2" paragraph>
										By downloading, using or accessing the SelfKey Identity
										Wallet (the “SelfKey Wallet”) you agree to the following
										terms and conditions of use (collectively, these “Terms”).
										Please read these Terms carefully. If you do not agree to
										all of these Terms, please do not use the SelfKey Wallet.
										Your use of the SelfKey Wallet constitutes your acceptance
										of and agreement to abide by each of these Terms.
									</Typography>
									<Typography variant="body2" paragraph>
										These Terms may be modified, changed, supplemented or
										updated by the SelfKey Foundation (“SelfKey”, “we”, “us” or
										“our”) in our sole discretion at any time without advance
										notice. We suggest that you visit this page regularly to
										keep up to date with any changes. Your continued use of the
										SelfKey Wallet will confirm your acceptance of these Terms
										as modified, changed, supplemented or updated. If you do not
										agree to such revised terms you must stop using the SelfKey
										Wallet.
									</Typography>
									<Typography variant="h3" paragraph>
										2) REPRESENTATIONS AND WARRANTIES
									</Typography>
									<Typography variant="subtitle1" paragraph>
										2.1 You expressly understand and agree that your use of the
										SelfKey Wallet is at your sole risk. The SelfKey Wallet is
										provided without warranties of any kind, either express or
										implied, including, without limitation, implied warranties
										of merchantability, fitness for a particular purpose or
										non-infringement.
									</Typography>
									<List>
										<ListItem>
											You are of sufficient age and have full legal capacity
											under the laws of the jurisdiction where you are
											domiciled or maintain citizenship to enter into these
											Terms;
										</ListItem>
										<ListItem>
											You have read, understood and agreed to these Terms;
										</ListItem>
										<ListItem>
											You are permitted by the laws of your jurisdiction to
											acquire, receive and hold cryptographic tokens;
										</ListItem>
										<ListItem>
											You understand distributed ledger technology and
											cryptographic tokens, and you are fully aware of the
											risks associated with them;
										</ListItem>
										<ListItem>
											You are experienced in and fully capable of operating,
											maintaining and safekeeping the SelfKey Wallet.
										</ListItem>
									</List>
									<Typography variant="h3" paragraph>
										3) ASSUMPTION OF RISKS
									</Typography>
									<Typography variant="body2" paragraph>
										You accept and acknowledge that there are risks associated
										with utilising the SelfKey Wallet including, but not limited
										to:
									</Typography>
									<Typography variant="subtitle1" paragraph>
										3.1 The risk of failure of hardware, software and Internet
										connections, the risk of malicious software introduction,
										and the risk that third parties may obtain unauthorised
										access to information stored within your SelfKey Wallet,
										including, but not limited to your SelfKey Wallet address
										and private key. You accept and acknowledge that SelfKey
										will not be responsible for any communication failures,
										disruptions, errors, distortions or delays you may
										experience when using the SelfKey Wallet, howsoever caused.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										3.2 The inherent risks associated with cryptographic
										systems. You acknowledge that you have an understanding of
										the usage and intricacies of native cryptographic tokens
										smart contract based tokens, and blockchain-based software
										systems generally.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										3.3 The risk that the SelfKey Wallet could be impacted by
										one or more regulatory inquiries or regulatory actions,
										which could impede or limit your ability to access or use
										the SelfKey Wallet.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										3.4 The risk that the SelfKey Wallet and other Ethereum
										applications are code subject to flaws. You acknowledge that
										you are solely responsible for evaluating the
										trustworthiness of any third-parties, third-party products
										or smart contracts you engage with through the SelfKey
										Wallet.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										3.5 The risks inherent in the fact that cryptography is
										constantly evolving and current systems cannot guarantee
										absolute security going forward. Advances in cryptographic
										methods or algorithms, or with technology, such as with
										quantum computing, could present risks to all
										cryptography-based systems. These advances could result in
										the theft, loss, disappearance or destruction of tokens held
										in your SelfKey Wallet.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										3.6 The risk that virtual currency may be lost or stolen.
										Virtual currency stored in the SelfKey Wallet is accessible
										by a private key, which is simply a unique string of text.
										The loss or destruction of a private key may render the
										currency inaccessible. Further, if a private key is acquired
										or copied by another person, that person may be able to
										obtain the currency stored on the SelfKey Wallet. You
										acknowledge that you are responsible for safeguarding the
										private key to your SelfKey Wallet. SelfKey will not be
										liable for any losses due to any situation in which a
										private key is lost, divulged, destroyed or otherwise
										compromised.
									</Typography>
									<Typography variant="h3" paragraph>
										4) INDEMNITY
									</Typography>
									<Typography variant="body2" paragraph>
										To the fullest extent permitted by applicable law, you will
										indemnify, defend and hold harmless SelfKey and our
										respective past, present and future employees, officers,
										directors, contractors, consultants, equity holders,
										suppliers, vendors, service providers, parent companies,
										subsidiaries, affiliates, agents, representatives,
										predecessors, successors and assigns from and against all
										claims, damages, liabilities, losses, costs and expenses
										(including attorneys’ fees) that arise from or relate to:
										(i) your downloading, using or accessing the SelfKey Wallet;
										(ii) any violation of these Terms by you; and (iii) the
										violation of any rights of any other person or entity.
									</Typography>
									<Typography variant="body2" paragraph>
										We reserve the right to exercise sole control over the
										defence, at your expense, of any claim subject to
										indemnification pursuant to these Terms. This indemnity is
										in addition to, and not in lieu of, any other indemnities
										set forth in a written agreement between you and SelfKey.
									</Typography>
									<Typography variant="h3" paragraph>
										5) DISCLAIMER
									</Typography>
									<Typography variant="subtitle1" paragraph>
										5.1 The SelfKey Wallet is provided on an “as-is” basis
										without any representations, warranties, promises or
										guarantees whatsoever of any kind including, without
										limitation, any representations, warranties, promises or
										guarantees regarding the adequacy, suitability or operation
										of the SelfKey Wallet.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										5.2 SelfKey disclaims all representations and warranties,
										whether express, implied or statutory including, without
										limitation: (a) any warranties that the SelfKey Wallet is
										free of viruses, worms, Trojan horses or other harmful
										components; (b) any warranties that the SelfKey Wallet or
										its code are error-free or that any such defects or errors
										will be corrected; (c) any warranties of title or implied
										warranties of merchantability or fitness for a particular
										purpose of the SelfKey Wallet; (d) any warranties that the
										SelfKey Wallet will be compatible with your computer or
										other electronic equipment; and (f) any warranties of
										non-infringement.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										5.3 In addition, to the maximum extent permitted by law,
										SelfKey shall not be responsible or liable for:
									</Typography>
									<Typography variant="subtitle1" paragraph>
										(a) any loss, liability, cost, expense or damage suffered or
										incurred arising out of or in connection with any access to
										or use of the SelfKey Wallet; or
									</Typography>
									<Typography variant="subtitle1" paragraph>
										(b) any matter affecting the SelfKey Wallet or its utility
										caused by circumstances beyond our reasonable control;
									</Typography>
									<Typography variant="subtitle1" paragraph>
										5.4 SelfKey may make improvements and/or changes to the
										SelfKey Wallet as SelfKey, in its sole discretion, may deem
										appropriate or advisable, at any time.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										5.5 In no event will SelfKey be responsible or liable for
										any claims, damages, liabilities, losses, costs or expenses
										of any kind, whether direct or indirect, consequential,
										compensatory, incidental, actual, exemplary, punitive or
										special (including damages for loss of business, revenues,
										profits, data, use, goodwill or other intangible losses)
										regardless of whether SelfKey has been advised of the
										possibility of such damages, liabilities, losses, costs or
										expenses, arising out of or in connection with: (a) SelfKey
										Wallet user error such as forgotten passwords or private
										keys, incorrectly constructed transactions, or mistyped
										virtual currency addresses; (b) any data or other loss from
										a SelfKey Wallet; (c) corrupted wallet files; (d)
										unauthorised access to a SelfKey Wallet; (e) any
										unauthorised third party activities, including without
										limitation, the use of viruses, phishing, brute forcing or
										other means of attack against a SelfKey Wallet; (f) the use
										or performance of a SelfKey Wallet generally; or (g) the
										failure in the transmission of any virtual currency, data,
										funds or property from a SelfKey Wallet.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										5.6 Any and all indemnities, warranties, terms and
										conditions (whether express or implied) are hereby excluded
										to the fullest extent permitted under the law of the Cayman
										Islands.
									</Typography>
									<Typography variant="subtitle1" paragraph>
										5.7 SelfKey will not be liable, in contract, or tort
										(including, without limitation, negligence), other than
										where we have been fraudulent or made negligent
										misrepresentations.
									</Typography>
									<Typography variant="h3" paragraph>
										6) NO WAIVER
									</Typography>
									<Typography variant="body2" paragraph>
										From time to time, SelfKey may fail to require or strictly
										enforce compliance in relation to any provision in these
										Terms. SelfKey may also fail to exercise any or all of its
										rights empowered herein. Any such failure shall not be
										construed as a waiver or relinquishment of SelfKey&#39;s
										right to assert or rely upon any such provision or right in
										that or in any other instance. If applicable, an express
										waiver given by SelfKey of any condition, provision, or
										requirement of these Terms shall not constitute a waiver of
										any future obligation to comply with such condition,
										provision or requirement.
									</Typography>
									<Typography variant="h3" paragraph>
										7) SEVERABILITY
									</Typography>
									<Typography variant="body2" paragraph>
										If any portion of these Terms is held to be illegal,
										unenforceable or invalid, whether in whole or part, under
										the laws of any jurisdiction, that portion shall be severed,
										and such illegality, unenforceability or invalidity shall
										not affect the legality, enforceability or validity of the
										rest of these Terms in that jurisdiction, nor the legality,
										enforceability or validity of these Terms in any other
										jurisdiction.
									</Typography>
									<Typography variant="h3" paragraph>
										8) GOVERNING LAW AND JURISDICTION
									</Typography>
									<Typography variant="body2" paragraph>
										These Terms are governed by the laws of the Cayman Islands.
										Any present or future law which operates to vary the
										obligations of SelfKey in connection with these Terms with
										the result that SelfKey’s rights, powers or remedies are
										adversely affected (including by way of delay or
										postponement) is excluded except to the extent that its
										exclusion is prohibited or rendered ineffective by law.
									</Typography>
									<Typography variant="body2" paragraph>
										You agree to submit any Dispute (as defined below) to
										arbitration. To the extent that the agreement to arbitrate
										is ineffective or void, you agree to submit to the exclusive
										jurisdiction of the courts of the Cayman Islands.
									</Typography>
									<Typography variant="h3" paragraph>
										9) SUBMISSION TO ARBITRATION
									</Typography>
									<Typography variant="body2" paragraph>
										Any dispute, claim, suit, action, cause of action, demand,
										or proceeding arising out of or related to these Terms (any
										&#34;Dispute&#34;) that is not settled by you and SelfKey
										within 30 days from the date that either party notifies the
										other party in writing of the Dispute shall be referred to
										and finally settled by arbitration in accordance with the
										provisions of the Cayman Islands Arbitration Law, 2012.
										Further, the parties hereby agree that:
									</Typography>
									<List>
										<ListItem>
											The law of this section is Cayman Islands law;
										</ListItem>
										<ListItem>
											The seat of arbitration will be the Cayman Islands;
										</ListItem>
										<ListItem>
											The number of arbitrators will be three;
										</ListItem>
										<ListItem>
											If the parties do not agree on the arbitrator to be
											appointed within 30 Days of the Dispute proceeding to
											arbitration, the arbitrator is to be appointed by the
											Grand Court of the Cayman Islands; and
										</ListItem>
										<ListItem>
											The arbitration proceedings will be conducted in
											English.
										</ListItem>
									</List>
									<Typography variant="body2" paragraph>
										Notwithstanding any other provision of these Terms, you
										agree that SelfKey has the right to apply for injunctive
										remedies (or an equivalent type of urgent legal relief) in
										any jurisdiction.
									</Typography>
									<Typography variant="h3" paragraph>
										10) PRIVACY POLICY
									</Typography>
									<Typography variant="body2" paragraph>
										Please refer to our Privacy Policy at
										(https://selfkey.org/privacy-policy.html)
									</Typography>
									<Typography variant="h3" paragraph>
										11) INTELLECTUAL PROPERTY
									</Typography>
									<Typography variant="body2" paragraph>
										SelfKey retains all right, title and interest in and to the
										SelfKey Wallet including all copyright, patents, trade
										secrets, trade marks, trade names, logos, slogans, custom
										graphics, button icons, scripts, videos, text, images,
										software, code, files, content, information and other
										intellectual property rights and nothing may be copied,
										imitated or used, in whole or in part, without our express
										prior written consent. SelfKey reserves all rights not
										expressly granted.
									</Typography>
									<Typography variant="body2" paragraph>
										Nothing in these Terms will be construed as conferring any
										right or license to any patent, trademark, copyright or
										other intellectual property or proprietary rights of SelfKey
										or any third party by implication or otherwise.
									</Typography>
									<Typography variant="h3" paragraph>
										12) NO PRIVATE KEY RETRIEVAL
									</Typography>
									<Typography variant="body2" paragraph>
										SelfKey does not receive or store your SelfKey Wallet
										private key, associated passwords or addresses. Therefore,
										we cannot assist you with the retrieval of your SelfKey
										Wallet private key. If you have not safely stored a backup
										of any wallet addresses and private keys maintained in your
										SelfKey Wallet, you accept and acknowledge that any currency
										you have associated with such wallet addresses will become
										inaccessible if you do not have your SelfKey Wallet private
										key.
									</Typography>
									<Typography variant="h3" paragraph>
										13) TRANSACTIONS
									</Typography>
									<Typography variant="body2" paragraph>
										In order to be completed, all proposed virtual currency
										transactions must be confirmed and recorded in the public
										ledger associated with the relevant currency network. Such
										networks are decentralised, peer-to-peer networks supported
										by independent third-parties, which are not owned,
										controlled or operated by SelfKey.
									</Typography>
									<Typography variant="h3" paragraph>
										14) NO STORAGE OR TRANSMISSION OF VIRTUAL CURRENCY
									</Typography>
									<Typography variant="body2" paragraph>
										Cyrptographic tokens are an intangible, digital asset. They
										exist only by virtue of the ownership record maintained in
										the underlying currency network. Any transfer of title that
										might occur in any virtual currency occurs on the
										decentralised ledger within the virtual currency network.
										SelfKey does not guarantee the transfer of title or right in
										any virtual currency.
									</Typography>
									<Typography variant="h3" paragraph>
										15) RELATIONSHIP
									</Typography>
									<Typography variant="body2" paragraph>
										Nothing in these Terms is intended to nor shall it create
										any partnership, joint venture, agency, consultancy or
										trusteeship, you and SelfKey being with respect to one
										another independent contractors.
									</Typography>
									<Typography variant="h3" paragraph>
										16) TAXES
									</Typography>
									<Typography variant="body2" paragraph>
										It is your responsibility to determine what, if any, taxes
										apply to the transactions made using your Selfkey Wallet and
										it is your responsibility to report and remit the correct
										tax to the appropriate tax authority. SelfKey is not
										responsible for determining whether taxes apply to your
										virtual currency transactions or for collecting, reporting,
										withholding or remitting any taxes arising from any such
										transactions.
									</Typography>
									<Typography variant="h3" paragraph>
										17) GENERAL
									</Typography>
									<Typography variant="body2" paragraph>
										These Terms are governed by the laws of the Cayman Islands.
										All claims arising out of or relating to these Terms will be
										litigated exclusively in the courts of the Cayman Islands
										and you consent to personal jurisdiction in those courts.
									</Typography>
									<Typography variant="body2" paragraph>
										These Terms control the relationship between us and you.
										They do not create any third-party beneficiary rights. If
										you do not comply with these Terms, and we don’t take action
										right away, this does not mean that we are giving up any
										rights that we may have, such as taking action in the
										future. If it turns out that a particular term is not
										enforceable, the term will be modified such that it is
										enforceable and this will not affect any other terms
										contained herein.
									</Typography>
									<Typography variant="body2" paragraph>
										If you have any questions regarding these Terms, please
										contact us at:{' '}
										<Link href={'mailto:help@selfkey.org'}>
											help@selfkey.org
										</Link>
									</Typography>
									<Typography variant="body2" paragraph>
										SelfKey reserves all rights in the look and feel of the
										SelfKey Wallet. Some parts of the SelfKey Wallet. are
										licensed under third-party open source licenses. We also
										make some of our own code available under open source
										licenses. As for other parts of the SelfKey Wallet, you may
										not copy or adapt any portion of our code or visual design
										elements (including logos) without express written
										permission from SelfKey unless otherwise permitted by law.
									</Typography>
									<Typography variant="h3" paragraph>
										18) CRASH REPORT &#38; ANALYTIC
									</Typography>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.crashReportAgreement}
												onChange={this.toogleCrashReportAgreement}
											/>
										}
										label="[Default opt-in] I voluntarily agree to anonymously share
										crash report &#38; analytics data with the SelfKey
										Foundation. This information will be used to improve the
										performance of the SelfKey Identity Wallet. The sharing of
										crash reports and analytics data is not mandatory and users
										may opt-out if they choose to not share this information."
									/>
								</Grid>
								<Grid item>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="center"
										spacing={24}
									>
										<Grid item>
											<Button
												id="agree"
												variant="contained"
												size="large"
												onClick={this.handleAgree}
											>
												I AGREE TO THE TERMS OF SERVICE
											</Button>
										</Grid>
										<Grid item>
											<Button
												variant="outlined"
												size="large"
												onClick={this.handleDisagree}
											>
												I DON&#39;T AGREE
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</ModalBody>
					</Paper>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Terms));
