import React, { PureComponent } from 'react';
import {
	Grid,
	Typography,
	List,
	Link,
	ListItem,
	Button,
	Checkbox,
	FormControlLabel
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { appOperations } from 'common/app';
import { push } from 'connected-react-router';
import { Popup } from '../common';

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
		minHeight: 0,
		'& li': {
			lineHeight: '1.4'
		}
	},
	flexColScroll: {
		flexGrow: 1,
		margin: '40px 0 20px',
		maxHeight: '400px',
		overflow: 'auto',
		padding: '0 20px !important'
	},
	'@media screen and (max-height: 800px)': {
		flexColScroll: {
			maxHeight: '280px'
		}
	},
	'@media screen and (min-height: 801px) and (max-height: 900px)': {
		flexColScroll: {
			maxHeight: '300px'
		}
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
			<Popup open displayLogo text="Terms of Service Agreement">
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems="flex-start"
					className={classes.flexSection}
					spacing={5}
				>
					<Grid id="terms" item className={classes.flexColScroll}>
						<Typography variant="h3" paragraph>
							SELFKEY USER AGREEMENT
						</Typography>
						<Typography variant="body2" paragraph>
							PLEASE CAREFULLY READ THIS USER AGREEMENT AND ALL OTHER AGREEMENTS AND
							POLICIES REFERENCED HEREIN (COLLECTIVELY DEFINED BELOW AS THE {'"'}TERMS
							OF SERVICE{'"'}) AS THEY CONTAIN IMPORTANT INFORMATION REGARDING YOUR
							LEGAL RIGHTS, REMEDIES, AND OBLIGATIONS. THE TERMS OF SERVICE INCLUDE
							VARIOUS LIMITATIONS AND EXCLUSIONS AND A CLASS ACTION WAIVER.
						</Typography>
						<Typography variant="body2" paragraph>
							This User Agreement (this {'"'}Agreement{'"'}) is a binding legal
							agreement between you ({'"'}you,{'"'} {'"'}your{'"'} or {'"'}User{'"'}),
							SelfKey Wallet LLC, a Nevis Limited Liability Company ({'"'}SelfKey,
							{'"'} {'"'}we,
							{'"'} {'"'}us,{'"'} or {'"'}our{'"'}). You must read, agree to, and
							accept all of the terms and conditions contained in this Agreement to be
							a User of our online portal ({'"'}the Portal{'"'}), whether available
							through our desktop software, through a web browser or through one of
							our mobile device applications. Further, you must read, agree to, and
							accept all of the terms and conditions contained in this Agreement to be
							a User of services associated with the Portal (the {'"'}Portal Services
							{'"'}), available through one or more application programming interfaces
							({'"'}APIs{'"'}).
						</Typography>
						<Typography variant="body2" paragraph>
							If you agree to the Terms of Service on behalf of a company or other
							business organization, whether formally registered with a governmental
							authority or otherwise (a {'"'}Business Organization{'"'}), you
							represent and warrant that you have the authority to legally bind such
							Business Organization, and you further agree that you are binding both
							you and the Business Organization to the Terms of Service. In such a
							case, {'"'}you,{'"'} {'"'}your{'"'} and {'"'}User{'"'} will refer and
							apply to both you and the Business Organization.
						</Typography>
						<Typography variant="body2" paragraph>
							This Agreement includes and hereby incorporates by reference the
							following important agreements, as they may be in effect and modified
							from time to time: SelfKey Privacy Policy; SelfKey Software License
							Agreement; Agreement with Certifier or Relying Party; and API Terms of
							Use. These agreements are collectively, with this Agreement, called the
							{'"'}Terms of Service{'"'}.
						</Typography>
						<Typography variant="body2" paragraph>
							In accordance with the SelfKey Software License Agreement, we grant you
							a license to our software that may be used to access the Portal and the
							Portal Services. We reserve all other rights.
						</Typography>

						<Typography variant="h3" paragraph>
							1) AMENDMENTS AND UPDATES
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 1 discusses how you must continue to agree to the current
							version of the Terms of Service anytime they are updated, or anytime you
							use the Portal or Portal Services after a software update.
						</Typography>
						<Typography variant="body2" paragraph>
							Subject to the conditions set forth herein, SelfKey may, in its sole
							discretion, amend this Agreement and other provisions within the Terms
							of Service at any time by posting a revised version on the Portal. Any
							revisions to the Terms of Service will take effect on the effective date
							(each, as applicable, the {'"'}Effective Date{'"'}) as posted on the
							Portal.
						</Typography>
						<Typography variant="body2" paragraph>
							Further, from time to time updates to the Portal or Portal Services may
							be issued by SelfKey. Depending on the update, you may not be able to
							use the Portal or the Portal Services until you have downloaded and
							installed the latest software update or use the latest protocol version.
							Your usage of the Portal or the Portal Services after such an update
							indicates your acceptance of the then-current Terms of Service.
						</Typography>
						<Typography variant="body2" paragraph>
							YOU UNDERSTAND THAT BY USING THE PORTAL OR ANY PORTAL SERVICES AFTER THE
							EFFECTIVE DATE OR AFTER AN UPDATE, YOU AGREE TO BE BOUND BY THE
							THEN-CURRENT TERMS OF SERVICE. IF YOU DO NOT ACCEPT THE TERMS OF SERVICE
							IN ITS ENTIRETY AT THAT POINT, YOU MUST NOT ACCESS OR USE THE PORTAL OR
							THE PORTAL SERVICES.
						</Typography>

						<Typography variant="h3" paragraph>
							2) ACCOUNTS
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 2 discusses what you must agree to before using the Portal
							or Portal Services and the different types of accounts that can be
							created on the Portal, as detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							2.1) Account Registration
						</Typography>
						<Typography variant="body2" paragraph>
							By registering for an account to use the Portal or Portal Services (an
							{' "'}Account{'"'}), or by using the Portal or Portal Services after the
							Effective Date if you had an Account on the Effective Date, or by
							clicking to accept the Terms of Service when prompted on the Portal, you
							agree to abide by this Agreement and the other Terms of Service.
						</Typography>
						<Typography variant="body2" paragraph>
							To access and use certain portions of the Portal and the Portal
							Services, you must register for an Account. Certain portions of the
							Portal may be available to visitors, subject to this Agreement,
							including those portions before your Account registration is accepted.
							SelfKey reserves the right to decline a registration or to add an
							Account of any type (i.e., as a Client, Certifier or Relying Party, all
							as defined below), for any lawful reason, including supply and demand,
							cost to maintain data, or other business considerations.
						</Typography>
						<Typography variant="body2" paragraph>
							2.2) Account Eligibility
						</Typography>
						<Typography variant="body2" paragraph>
							2.2.1) To register for an Account or use the Portal and Portal Services,
							you must, and hereby represent and warrant:
						</Typography>
						<List>
							<ListItem>
								(a) that you have read, understood and agreed to these Terms of
								Service, including, without limitation, our SelfKey Privacy Policy
								[https://selfkey.org/privacy-policy.html]. Further, you acknowledge
								and agree that (1) communications via the Internet are never
								completely private or secure, and (2) our maintenance, upkeep and
								improvement of the Portal and Portal Services necessitates our
								collection of certain technical, non-personally identifiable
								information about your usage;
							</ListItem>
							<ListItem>
								(b) that you are an individual who has reached the age of majority,
								and you can enter into legally binding contracts in the
								jurisdictions (1) in which you reside and (2) in which you access
								the Portal and/or use any Portal Service (collectively, {'"'}Your
								Jurisdictions{'"'});
							</ListItem>
							<ListItem>
								(c) that you are permitted by the laws and regulations of Your
								Jurisdictions to acquire, receive, transfer, hold or control
								cryptocurrencies, cryptographic tokens, and digital assets
								(collectively, {'"'}Digital Assets{'"'});
							</ListItem>
							<ListItem>
								(d) that you are entirely responsible for compliance with all laws,
								regulations, decrees, treaties, and administrative acts applicable
								to Your Jurisdictions, including, but not limited to, export and
								import regulations, money service business regulations, financial
								services regulations and sanctions programs;
							</ListItem>
							<ListItem>
								(e) that you are not a citizen or resident of, or located in, a
								geographic area that is subject to U.S. or other sovereign country
								sanctions or embargoes; or an individual, or an individual employed
								by or associated with an entity, identified on the U.S. Department
								of Commerce Denied Persons or Entity List, the U.S. Department of
								Treasury Specially Designated Nationals or Blocked Persons Lists, or
								the U.S. Department of State Debarred Parties List or otherwise
								ineligible to receive items subject to U.S. export control laws and
								regulations or other economic sanction rules of any sovereign
								nation. If Your Jurisdictions or other circumstances change such
								that the above representations are no longer accurate, you agree to
								immediately cease use of the Portal and Portal Services, and further
								agree and understand that your Account may be closed.
							</ListItem>
							<ListItem>
								(f) if you create an Account as a Business Organization, that you
								are authorized to act on behalf of such Business Organization,
								including the authorization to bind the Business Organization to the
								Terms of Service. You further acknowledge and agree on behalf of the
								Business Organization that it is solely responsible and assumes all
								liability for (a) the actions of its agents, employees and
								independent contractors; and (b) the payment to its agents,
								employees and independent contractors in accordance with applicable
								law for work performed on behalf of the Business Organization;
							</ListItem>
							<ListItem>
								(g) that the Portal or Portal Services may contain links to
								independent third-party websites ({'"'}Third-party Sites{'"'}) or
								interface connections to independent third-party services ({'"'}
								Third-party Services{'"'}). You acknowledge and agree that
								Third-party Sites and Third-Party Services are not under our
								control, and we are not responsible for and do not endorse their
								function, content or policies. You will need to make your own
								independent judgement regarding your interaction with any
								Third-party Sites or Third-party Services, including the purchase
								and use of any products or services accessible through them;
							</ListItem>
							<ListItem>
								(h) that Digital Assets may be ascribed value by external services
								or markets, either in terms of a fiat cash valuation, or a valuation
								expressed in other Digital Assets. You acknowledge and agree that we
								make no representations or warranties about any valuation ascribed
								to Digital Assets, which depend entirely on such external services
								or markets. Accordingly, you acknowledge and agree that we shall
								have no liability for any fluctuations in the value of Digital
								Assets; and
							</ListItem>
							<ListItem>
								(i) that you are sufficiently experienced with the function and use
								of Digital Assets and digital wallets for Digital Assets ({'"'}
								Wallets{'"'}), and that you are sufficiently sophisticated with
								regard to distributed ledger technologies in general to be able to
								safeguard yourself from the risk of loss associated with them.
							</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							2.2.2) To register for an Account or use the Portal and Portal Services,
							you must, and hereby acknowledge and agree that your use of the Portal
							and/or Portal Services are at your sole risk, and that you freely
							acknowledge and accept all associated risks, including, but not limited
							to:
						</Typography>
						<List>
							<ListItem>
								(a) the risk of failure of hardware, software and Internet
								connections. You accept and acknowledge that SelfKey will not be
								responsible for any communication failures, disruptions, errors,
								distortions or delays you may experience when using the Portal or
								Portal Services, howsoever caused;
							</ListItem>
							<ListItem>
								(b) the risk of malicious software introduction, which could allow
								third parties to obtain unauthorized access to information stored
								within your Account, including, but not limited to addresses,
								private keys or seed phrases associated with your Digital Assets;
							</ListItem>
							<ListItem>
								(c) the risk of faults or vulnerabilities in the software that
								allows you to access the Portal or the Portal Services, whether in
								code written directly by us, or whether through integrated
								open-source libraries or components developed by third parties. Such
								software faults or vulnerabilities could allow third parties to
								obtain unauthorized access to information stored within your
								Account, including, but not limited to addresses, private keys or
								seed phrases associated with your Digital Assets. SelfKey makes no
								representation that any fault or vulnerability will be corrected or
								otherwise addressed;
							</ListItem>
							<ListItem>
								(d) the inherent risks associated with smart contracts. You
								acknowledge that you have an understanding of the usage and
								potential vulnerabilities of smart contracts that may be utilized by
								the Portal, the Portal Services, and some Digital Assets that may be
								managed therein. You acknowledge and agree that you are solely
								responsible for evaluating the trustworthiness of any smart
								contracts you engage with through the Portal and/or Portal Services;
							</ListItem>
							<ListItem>
								(e) the risk that the Portal or Portal Services could be impacted by
								one or more regulatory inquiries or regulatory actions, which could
								impede or limit your ability to access or use them. The Portal and
								the Portal Services are not likely regulated by the governmental
								authority regulating the financial services in Your Jurisdictions.
								Accordingly, the Portal and/or Portal Services should not be used as
								a substitute for banking services, nor as a substitution for any
								other form of regulated financial services activity;
							</ListItem>
							<ListItem>
								(f) the risks inherent in the fact that cryptography is constantly
								evolving and current systems cannot guarantee absolute security
								going forward. Advances in cryptographic methods or algorithms, or
								with technology, such as with quantum computing, could present risks
								to all cryptography-based systems. These advances could result in
								the theft, loss, disappearance or destruction of Digital Assets
								managed in your Account;
							</ListItem>
							<ListItem>
								(g) the risk that your private keys or seed phrases may be lost or
								stolen. Digital Assets and other assets managed in your Account are
								accessible by a private key, which is simply a unique string of
								text, or a seed phrase, which is a series of common words. The loss
								or destruction of your private key or seed phrase may render your
								Digital Assets and other assets inaccessible. Further, if your
								private key or seed phrase is acquired or copied by another person,
								that person may be able to transfer these assets away from your
								possession. You acknowledge that you are responsible for
								safeguarding the private keys and seed phrases associated with your
								Account. SelfKey will not be liable for any losses due to any
								situation in which a private key or seed phrase is lost, divulged,
								destroyed or otherwise compromised;
							</ListItem>
							<ListItem>
								(h) the risk that distributed ledger technology protocols may not
								function properly, or at all. The Portal and Portal Services rely on
								the proper functioning of blockchain and other distributed ledger
								technology protocols that are not owned or controlled by SelfKey.
								These protocols include publicly-available or open source code that
								may not have been subject to sufficient security and other audits.
								Further, such protocols are subject to various attacks, including,
								but not limited to, double-spend attacks, majority mining power
								attacks, selfish-mining attacks, and race condition attacks.
								Finally, protocols could become destabilized due to increased costs
								of running distributed applications or the general insufficiency of
								computational or other resources necessary to effectively operate
								such protocol. SelfKey disclaims all liability for any failure by
								these protocols to operate as expected or at all, whether due to
								faults, vulnerabilities, attacks or de-stabilization events;
							</ListItem>
							<ListItem>
								(i) the risk that distributed ledger technology protocols may be
								subject to change. Blockchain and other distributed ledger
								technology protocols are constantly evolving and are further subject
								to {'"'}forks,{'"'} in which protocols are split into two or more
								branches that operate independently from one another. You
								acknowledge and agree that SelfKey shall have no responsibility for
								any changes to such protocols, such as any forking of protocols that
								result in multiple instances of them existing simultaneously;
							</ListItem>
							<ListItem>
								(j) the risk that any information obtained by you as a result of
								your use of the Portal or the Portal Services will be accurate,
								reliable, timely or properly updated.
							</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							2.3) Account Profile; Identity and Information Verification
						</Typography>
						<Typography variant="body2" paragraph>
							2.3.1) Account Profile
						</Typography>
						<Typography variant="body2" paragraph>
							To register for an Account, you must complete a User profile ({'"'}
							Profile{'"'}), which may be shown to other Users. You agree to provide
							true, accurate, and complete information on your Profile, including on
							any documents you may upload or refer to, and you further agree to
							update your information and/or documents to maintain their truthfulness,
							accuracy, and completeness. You agree not to provide any false or
							misleading information at any time on the Portal or through the Portal
							Services about your identity, residence, physical location, your
							business, your skills, or the services your business provides, and you
							further agree to correct any information that is or becomes false or
							misleading.
						</Typography>
						<Typography variant="body2" paragraph>
							2.3.2) Decentralized ID
						</Typography>
						<Typography variant="body2" paragraph>
							If you wish to participate in the Marketplace Platform, as detailed in
							Section 5 below, you will need to create a {'"'}Decentralized ID{'"'}{' '}
							within the Portal or Portal Services. A Decentralized ID is a piece of
							string data that is stored on the Ethereum blockchain network. It serves
							as a unique identifier that allows your verified data on the SelfKey
							network to be referenced on the Ethereum blockchain network. Because it
							is stored on the Ethereum blockchain network, you agree and understand
							that the unique identifier portion of your Decentralized ID will be
							public and immutable.
						</Typography>
						<Typography variant="body2" paragraph>
							Under ordinary circumstances, a unique identifier stored on the Ethereum
							blockchain network cannot be traced to any specific User, except that
							data pertaining to payments and other recorded transactions may be
							analyzed to narrow down the universe of potential persons to whom the
							unique identifier is tied. However, under extraordinary circumstances,
							such as with a hack of a smart contract that controls or resolves your
							Decentralized ID, your unique identifier may be able to be referenced
							back to you, and, further, your data on the SelfKey network could even
							be compromised. You understand and agree that your Decentralized ID and
							any data associated with it on the SelfKey network are not guaranteed to
							be anonymous or fully secure.
						</Typography>
						<Typography variant="body2" paragraph>
							2.3.3) Verification with Certifier
						</Typography>
						<Typography variant="body2" paragraph>
							If you request the services of a Certifier within the Portal, any
							information you provide will be subject to verification, including, but
							not limited to, validation against third-party databases or the
							verification of one or more official government or legal documents that
							confirm your identity, your location, and your ability to act on behalf
							of your business on SelfKey. You authorize such Certifier to make any
							inquiries necessary to validate your identity and other information
							within the scope of your request, subject to applicable law. During
							validation some Account features may be temporarily limited.
						</Typography>
						<Typography variant="body2" paragraph>
							2.4) Account Types
						</Typography>
						<Typography variant="body2" paragraph>
							There are a number of different Account types that may be used in the
							Portal or with Portal Services. We reserve the right to revoke the
							privileges of the Account or access to or use of the Portal or Portal
							Services, and those of any and all linked Accounts without warning if,
							in our sole discretion, false or misleading information has been
							provided in creating, marketing, or maintaining your Profile or Account.
						</Typography>
						<Typography variant="body2" paragraph>
							2.4.1) Client Account
						</Typography>
						<Typography variant="body2" paragraph>
							You can register for an Account to use the Portal and Portal Services as
							a basic user of the Wallet features (a {'"'}Client{'"'}). Further, a
							Client may choose to utilize the services of Certifiers and Relying
							Parties (both as defined below).
						</Typography>
						<Typography variant="body2" paragraph>
							2.4.2) Certifier Account
						</Typography>
						<Typography variant="body2" paragraph>
							You can register for an Account to use the Portal and Portal Services as
							a service provider who attests and verifies identity claims of Clients
							(a {'"'}Certifier{'"'}). On the Portal and on SelfKey documentation
							these service providers may be referred to as {'"'}Notaries{'"'} or by
							other names. If you create an Account as a Certifier, you acknowledge
							and agree that you are solely responsible and assume all liability for
							the attestation or verification services you provide in connection with
							the Portal.
						</Typography>
						<Typography variant="body2" paragraph>
							2.4.3) Relying Party Account
						</Typography>
						<Typography variant="body2" paragraph>
							You can register for an Account to use the Portal and Portal Services as
							a provider of products and services to Clients (a {'"'}Relying Party
							{'"'}). On the Portal and on SelfKey documentation these service
							providers may be referred to offer services with names such as {'"'}
							Exchanges{'"'}, {'"'}Incorporation{'"'}, {'"'}Passport {'&'} Residencies
							{'"'}, {'"'}Bank Accounts{'"'}, {'"'}Loans{'"'}, among other labels. If
							you create an Account as a Relying Party, you acknowledge and agree that
							you are solely responsible and assume all liability for products and
							services you provide in connection with the Portal.
						</Typography>
						<Typography variant="body2" paragraph>
							2.5) Account Passwords
						</Typography>
						<Typography variant="body2" paragraph>
							Each person or Business Organization that uses the Portal or Portal
							Services must choose a password for the Account. You are entirely
							responsible for safeguarding and maintaining the confidentiality of your
							password. You agree not to share your password with any person, or, if
							you are a Business Organization, to only share your password with a
							person who is authorized to use your Account. You authorize SelfKey to
							assume that any person using the Portal with your password either is you
							or is authorized to act for you. You agree to notify us immediately if
							you suspect or become aware of any unauthorized use of your Account or
							any unauthorized access to the password for any Account. You further
							agree not to use the Account or log in with the password of another User
							of the Portal if (a) you are not authorized to do so, or (b) to do so
							would violate the Terms of Service.
						</Typography>

						<Typography variant="h3" paragraph>
							3) SCOPE OF PORTAL AND PORTAL SERVICES, GENERALLY
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 3 discusses what Users must agree to in order to use the
							Portal and/or the Portal Services. In addition to agreeing to the
							entirety of the Terms of Service, to use the Portal or the Portal
							Services, you hereby agree:
						</Typography>
						<List>
							<ListItem>
								(a) to not submit, post, email, display, transmit or otherwise make
								available through the Portal or Portal Service any material or take
								any action that is or is likely to be unlawful, harmful,
								threatening, abusive, tortious, defamatory, libelous, deceptive,
								fraudulent, invasive of another’s privacy or publicity rights,
								harassing, profane, obscene, vulgar or that contains explicit or
								graphic imagery, descriptions or accounts of excessive violence or
								sexual acts (including, without limitation, sexual language of a
								violent or threatening nature directed at another individual or
								group of individuals), contains a link to an adult website or is
								patently offensive, promotes racism, bigotry, hatred or physical
								harm of any kind against any group or individual;
							</ListItem>
							<ListItem>
								(b) to not submit, post, email, display, transmit or otherwise make
								available through the Portal or Portal Service any material that you
								do not have a right to make available under any law, rule or
								regulation or under contractual or fiduciary relationships (such as
								inside information, proprietary or confidential information learned
								or disclosed as part of employment relationships or under
								nondisclosure agreements), or otherwise creates a security or
								privacy risk for any other person or entity;
							</ListItem>
							<ListItem>
								(c) to not submit, post, email, display, transmit or otherwise make
								available through the Portal or Portal Service any material that
								contains a software virus, worm, spyware, Trojan horse or other
								computer code, file or program designed to interrupt, impair,
								destroy or limit the functionality of any computer software or
								hardware or telecommunications equipment;
							</ListItem>
							<ListItem>
								(d) to not modify, disrupt, impair, alter or interfere with the use,
								features, function, operation or maintenance of the Portal and the
								Portal Services or the rights or use or enjoyment of the Portal and
								the Portal Services by any other User;
							</ListItem>
							<ListItem>
								(e) to not impersonate any person or entity or falsely state or
								otherwise represent your affiliation with a person, or entity;
							</ListItem>
							<ListItem>
								(f) to not forge headers or otherwise manipulate identifiers in
								order to disguise the origin of any content transmitted on, through
								or in connection with the Portal and the Portal Services;
							</ListItem>
							<ListItem>
								(g) to not solicit passwords, Account or personal identifying
								information for commercial or unlawful purposes from other Users or
								engage in spamming, flooding, harvesting of email addresses or other
								personal information, {'"'}spidering{'"'}, {'"'}screen scraping{'"'}
								, {'"'}
								phishing{'"'}, {'"'}database scraping{'"'}, or any other activity
								with the purposes of obtaining lists of other Users or other
								information;
							</ListItem>
							<ListItem>
								(h) to not attempt to or actually manipulate or misuse the feedback
								or User Content system; and
							</ListItem>
							<ListItem>
								(i) to comply with all applicable technology control or export laws
								and regulations;
							</ListItem>
						</List>

						<Typography variant="h3" paragraph>
							4) SCOPE OF WALLET PLATFORM
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 4 discusses what SelfKey does and does not do when
							providing the Wallet Platform, as defined below. It further discusses
							some of your responsibilities and obligations when using the Wallet
							Platform to enter into a Transaction, as detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							4.1) Management of Digital Assets
						</Typography>
						<Typography variant="body2" paragraph>
							Through the Portal and the Portal Services you may conduct a number of
							functions with regard to its integrated Wallet platform (the {'"'}Wallet
							Platform{'"'}). SelfKey provides the Wallet Platform to Users, including
							its hosting and maintenance, subject to the Terms of Service.
						</Typography>
						<Typography variant="body2" paragraph>
							The Wallet Platform enables you to manage various Digital Assets
							associated with your Account. The Wallet Platform is a software platform
							only, and you acknowledge and agree that you are solely responsible for
							the management of your Digital Assets through this software platform.
						</Typography>
						<Typography variant="body2" paragraph>
							The Wallet Platform allows you to manage a finite list of select Digital
							Assets, and not every Digital Asset is capable of being managed. SelfKey
							reserves the right to add or remove particular Digital Assets from the
							scope of the Wallet Platform at any time without notice. The fact that
							any specific Digital Asset is featured within the scope of the Wallet
							Platform should not be interpreted as any form of endorsement or
							promotion by SelfKey.{' '}
						</Typography>
						<Typography variant="body2" paragraph>
							4.2) Transactions with Digital Assets
						</Typography>
						<Typography variant="body2" paragraph>
							The management of your Digital Assets includes your ability to transfer
							away your Digital Assets, or to receive Digital Assets from others (each
							such event, a {'"'}Transaction{'"'}). The choice to enter into
							Transactions is solely your own, and you acknowledge that SelfKey does
							not offer or undertake to verify the identity of any counterparty with
							whom you may choose to interact. You shall have sole responsibility for
							identifying and verifying the counterparties to Transactions that you
							elect to enter into, and you acknowledge and agree that SelfKey shall
							have no responsibility or liability in connection with any decision by
							you to enter into a Transaction. SelfKey shall have no liability to you
							in the event that you send Digital Assets to an unintended recipient.
						</Typography>
						<Typography variant="body2" paragraph>
							If you intend on making a Transaction that is especially important (for
							example, involving Digital Assets of a large value or involving a strict
							deadline), we recommend building in a 24-hour grace period for
							confirmation of deposits or transfers. If such deposits or transfers
							seem to fail or are delayed beyond what should be expected due to the
							current congestion on the network protocol, please contact us
							immediately at{' '}
							<Link href={'support@selfkey.org'}>support@selfkey.org</Link>.
						</Typography>
						<Typography variant="body2" paragraph>
							You acknowledge and agree that we have no ability to control your
							Transactions in any way, including, without limitation:
						</Typography>
						<List>
							<ListItem>
								(a) no ability to cancel or reverse any Transaction, or otherwise
								modify it;
							</ListItem>
							<ListItem>
								(b) no ability to speed up, or otherwise reduce any delay with any
								Transaction;
							</ListItem>
							<ListItem>
								(c) no ability to provide final confirmation to any Transaction
								(which may include a transfer of title or right); and
							</ListItem>
							<ListItem>
								(d) no ability to ensure that any goods or services you are
								purchasing in a Transaction are actually delivered satisfactorily;
							</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							4.3) Taxes and Withholding
						</Typography>
						<Typography variant="body2" paragraph>
							It is your responsibility to determine what, if any, taxes or
							withholding obligations apply to the Transactions made using the Wallet
							Platform, and it is your responsibility to report and remit the correct
							tax to the appropriate tax authority. SelfKey is not responsible for
							determining whether taxes apply to your Transactions in Your
							Jurisdiction, nor is SelfKey responsible for collecting, reporting,
							withholding or remitting any taxes or other amounts arising from any
							such Transactions.
						</Typography>

						<Typography variant="h3" paragraph>
							5) SCOPE OF MARKETPLACE PLATFORM
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 5 discusses what SelfKey does and does not do when
							providing the Marketplace Platform, as defined below. It further
							discusses some of your responsibilities and obligations when using the
							Marketplace Platform, as detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							Through the Portal and the Portal Services you may access an online
							marketplace in which Clients, Certifiers and Relying Parties can
							identify each other and advertise, buy, and sell products or services
							(the {'"'}Marketplace Platform{'"'}). SelfKey provides the Marketplace
							Platform to Users, including its hosting and maintenance, subject to the
							Terms of Service.
						</Typography>
						<Typography variant="body2" paragraph>
							5.1) Your Relationship With SelfKey
						</Typography>
						<Typography variant="body2" paragraph>
							The Marketplace Platform is a software platform only, and you
							acknowledge and agree that you are solely responsible for your actions
							and interactions through this software platform.
						</Typography>
						<Typography variant="body2" paragraph>
							SelfKey provides the Marketplace Platform to enable Clients, Certifiers
							and Relying Parties to find and transact directly with each other.
							SelfKey does not find or recommend Certifiers and Relying Parties to
							Clients, and SelfKey does not find or recommend Clients for Certifiers
							and Relying Parties. Through the Marketplace Platform, Certifiers and
							Relying Parties may be notified of Clients that may be seeking the
							services they offer, and Clients may be notified of Certifiers and
							Relying Parties that may offer the services they seek. At all times,
							however, Users are responsible for evaluating and determining the
							suitability of any business transaction that they may wish to enter into
							with one another.{' '}
						</Typography>
						<Typography variant="body2" paragraph>
							5.2) Product/Service Agreements
						</Typography>
						<Typography variant="body2" paragraph>
							If Users decide to enter into business transactions, they will enter
							into agreements for products or services ({'"'}Product/Service
							Agreements{'"'}) that are solely between Clients on the one hand, and
							Certifiers or Relying Parties on the other. Such Product/Service
							Agreements are directly between the Users, and SelfKey is not a party to
							any Product/Service Agreement.
						</Typography>
						<Typography variant="body2" paragraph>
							If Users are exploring whether to enter into a Product/Service
							Agreement, such Users have complete discretion both with regard to
							whether to enter into such Product/Service Agreement and, if they do so,
							with regard to its terms. Further, after entering into a Product/Service
							Agreement, Users may enter into any additional written agreements that
							they deem appropriate (e.g., confidentiality agreements), provided that
							any such agreements do not conflict with, narrow, or expand SelfKey’s
							rights and obligations under the Terms of Service.
						</Typography>
						<Typography variant="body2" paragraph>
							SelfKey makes no representations about and does not guarantee, and you
							agree not to hold SelfKey responsible for (a) the quality, safety, or
							legality of services or products offered under Product/Service
							Agreements; (b) the qualifications, background, or identities of Users
							offering products or services under Product/Service Agreements; (c) the
							ability or willingness of Users to deliver products or services under
							Product/Service Agreements; or (d) the ability of Users to pay for
							services or products under Product/Service Agreements.
						</Typography>
						<Typography variant="body2" paragraph>
							While SelfKey may provide certain badges on Profiles, such badges are
							not a guarantee or warranty of quality or ability or willingness of the
							badged User to satisfactorily complete a Product/Service Agreement. Such
							badges do not indicate a guarantee of any kind.
						</Typography>
						<Typography variant="body2" paragraph>
							You acknowledge, agree, and understand that:
						</Typography>
						<List>
							<ListItem>
								(a) SelfKey is not a party to any Product/Service Agreement, nor to
								the relationship or any dealings between Client and Certifier or
								Relying Party;
							</ListItem>
							<ListItem>
								(b) the formation of a Product/Service Agreement between Users will
								not, under any circumstance, create an employment or other service
								relationship between SelfKey and any User, nor will it create a
								partnership or joint venture between SelfKey and any User;
							</ListItem>
							<ListItem>
								(c) Certifiers and Relying Parties are solely responsible for
								determining, and have the sole right to determine, which
								Product/Service Agreements to accept; the time, place, manner, and
								means of providing any services or products; the type of services or
								products they provide; the price they charge for their services or
								products; and how pricing is determined or set;
							</ListItem>
							<ListItem>
								(d) you are solely responsible for assessing whether to enter into a
								Product/Service Agreement with another User and for verifying any
								information about any another User;
							</ListItem>
							<ListItem>
								(e) you are solely responsible for negotiating, agreeing to, and
								executing any terms or conditions of Product/Service Agreements; and
							</ListItem>
							<ListItem>
								(f) you are solely responsible for your obligations to other Users
								under Product/Service Agreements.
							</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							If you are a User that is a Certifier or Relying Party, you further
							acknowledge, agree, and understand that:
						</Typography>
						<List>
							<ListItem>
								(a) you are not an employee, agent or contractor for SelfKey, and
								you are not eligible for any of the rights or benefits of employment
								(including unemployment and/or workers compensation insurance);
							</ListItem>
							<ListItem>
								(b) you are not covered by nor eligible for any insurance from
								SelfKey, and you, yourself, must itself obtain any liability,
								health, workers’ compensation, disability, unemployment, or other
								insurance that is required by applicable law in Your Jurisdictions
								or that is otherwise needed or desired;
							</ListItem>
							<ListItem>
								(c) SelfKey will not have any liability or obligations, including
								those under or related to Product/Service Agreements, for any acts
								or omissions by you or other Users;
							</ListItem>
							<ListItem>
								(d) SelfKey does not, in any way, supervise, direct, or control any
								Certifier or Relying Party, impose quality standards or a deadline
								for completion of any services, nor dictate the performance, methods
								or process used to perform services;
							</ListItem>
							<ListItem>
								(e) Certifiers and Relying Parties are free to determine when and if
								to perform services, including the days worked and time periods of
								work, and SelfKey does not set or have any control over pricing,
								work hours, work schedules, or work location, nor is SelfKey
								involved in any other way in determining the nature and amount of
								any compensation that may be charged by or paid to Certifiers and
								Relying Parties for services or products;
							</ListItem>
							<ListItem>
								(f) Certifiers and Relying Parties will be paid at such times and
								amounts as agreed with a Client in a given Product/Service
								Agreement, and SelfKey does not, in any way, provide or guarantee
								any Certifier or Relying Party a regular salary or any minimum,
								regular payment;
							</ListItem>
							<ListItem>
								(g) SelfKey does not provide Certifiers and Relying Parties with
								training or any equipment, labor, tools, or materials related to any
								Product/Service Agreement;
							</ListItem>
							<ListItem>
								(h) SelfKey does not provide the premises at which Certifiers and
								Relying Parties will perform the work. Certifiers and Relying
								Parties are free to use subcontractors or employees to perform
								services and may otherwise delegate work;
							</ListItem>
							<ListItem>
								(i) SelfKey does not provide shipping services for any product; and
							</ListItem>
							<ListItem>
								(j) If you use subcontractors, employees or other work delegates,
								you agree and acknowledge that this Section 5 applies to SelfKey’s
								relationship with your subcontractors, employees and work delegates.
								You further acknowledge and agree that you are solely responsible
								for your own subcontractors, employees and work delegates.
							</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							5.3) Transfer of Decentralized ID Information
						</Typography>
						<Typography variant="body2" paragraph>
							You may utilize your Decentralized ID to purchase goods or services
							within the Marketplace Platform. In order to do so, you agree and
							consent to transfer your data to the service provider, whether a
							Certifier or Relying Party, within the scope of the applicable
							Product/Service Agreement. Your Decentralized ID may also be utilized to
							gain access to other platforms, prove eligibility to participate in
							contests or promotions, and to unlock other benefits. In all such cases,
							you agree and consent to transfer your data within the scope stated
							within the rules, terms or regulations governing such platform, contest,
							promotion or other benefit.
						</Typography>
						<Typography variant="body2" paragraph>
							You agree and understand that any transfer of data, especially those
							involving a blockchain network, is subject to risk. As such, you
							understand and agree that the above-referenced transfers of your data
							are not guaranteed to be anonymous or fully secure.
						</Typography>
						<Typography variant="body2" paragraph>
							5.4) User Content
						</Typography>
						<Typography variant="body2" paragraph>
							You hereby acknowledge and agree that Users may publish and request
							SelfKey to publish on their behalf information on the Portal (and
							accessible by Portal Services) about the User, such as feedback,
							composite feedback, biographical information, geographical location,
							description of services or products offered, or evidence of identity or
							credentials (collectively, {'"'}User Content{'"'}).{' '}
						</Typography>
						<Typography variant="body2" paragraph>
							5.4.1) Agreement to Publish; Grant of License to Your User Content
						</Typography>
						<Typography variant="body2" paragraph>
							SelfKey provides User Content within the Portal (and accessible by
							Portal Services) solely for the convenience of Users. You acknowledge
							and agree that User Content benefits all Users of the Portal and
							increases the efficiency of the marketplace. You acknowledge and agree
							that you desire SelfKey to publish User Content on User Profiles and
							elsewhere on the Portal. You further acknowledge and agree that User
							Content may include User comments, User ratings, indicators of User
							satisfaction, and other feedback left exclusively by other Users, and
							that SelfKey does not monitor, influence, contribute to or censor User
							Content.{' '}
						</Typography>
						<Typography variant="body2" paragraph>
							You retain copyright and any other rights you already hold in your User
							Content. You agree and understand that you are solely responsible for
							protecting and enforcing such rights, and that SelfKey has no obligation
							to do so on your behalf.
						</Typography>
						<Typography variant="body2" paragraph>
							By publishing or causing to publish User Content, you grant to SelfKey a
							perpetual, royalty-free, non-exclusive, and irrevocable right and
							license to use such User Content in connection with the provision and
							promotion of the Portal and Portal Services. Except for the foregoing,
							SelfKey obtains no right, title or interest from you (or your licensors)
							in or to any of your User Content, including any intellectual property
							rights which may subsist therein.{' '}
						</Typography>
						<Typography variant="body2" paragraph>
							5.4.2) SelfKey Right to Remove User Content
						</Typography>
						<Typography variant="body2" paragraph>
							In order to protect the integrity of the feedback system and protect
							Users from abuse, SelfKey reserves the right, but is under no
							obligation, to remove posted feedback or information that, in SelfKey’s
							sole judgment (a) violates the Terms of Service; (b) negatively affects
							the Marketplace Platform; (c) diminishes the integrity of the feedback
							system, or (d) is otherwise inconsistent with the business interests of
							SelfKey.
						</Typography>
						<Typography variant="body2" paragraph>
							5.4.3) Further Acknowledgements and Agreements
						</Typography>
						<Typography variant="body2" paragraph>
							You further acknowledge, agree, and understand that:
						</Typography>
						<List>
							<ListItem>
								(a) User Content is based solely on unverified data that Users
								voluntarily submit to SelfKey and does not constitute and will not
								be construed as an introduction, endorsement, or recommendation by
								SelfKey;
							</ListItem>
							<ListItem>
								(b) SelfKey does not make any representations about, or guarantee
								the truth or accuracy of, any User Content, including any feedback
								or other information provided by Users;
							</ListItem>
							<ListItem>
								(c) you are solely responsible for your own User Content, including
								its accuracy, veracity and compliance with applicable law. You
								acknowledge and agree that you will notify SelfKey of any error or
								inaccurate statement in your User Content, including feedback;
							</ListItem>
							<ListItem>
								(d) you may not to use User Content to make any employment, credit,
								credit valuation, underwriting, or other similar decision about any
								other User; and
							</ListItem>
							<ListItem>
								(e) you are solely responsible for any legal action that may be
								instituted by other Users or by third parties as a result of or in
								connection with your User Content. You agree that SelfKey is not
								legally responsible for any User Content or other information posted
								or made available on the Portal (or accessible by Portal Services)
								by you or under your request, and you further acknowledge that your
								indemnification of SelfKey in Section 11 hereunder covers any claim
								or loss resulting from any such User Content or other information.
							</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							5.5) Taxes and Withholding; Audits
						</Typography>
						<Typography variant="body2" paragraph>
							It is your responsibility to determine what, if any, taxes or
							withholding obligations apply to any transactions under any
							Product/Service Agreement. It is your responsibility to report and remit
							the correct tax to the appropriate tax authority. SelfKey is not
							responsible for determining whether taxes apply in Your Jurisdiction to
							any transaction, nor is SelfKey responsible for collecting, reporting,
							withholding or remitting any taxes or other amounts arising from any
							transaction.
						</Typography>
						<Typography variant="body2" paragraph>
							If you are a User that is a Certifier or Relying Party, you acknowledge
							and agree that:
						</Typography>
						<List>
							<ListItem>
								(a) you are solely responsible for all tax liabilities associated
								with payments received from Clients or through the Portal or via the
								Portal Services;
							</ListItem>
							<ListItem>
								(b) you must be responsible for the proper remittance of any
								withholding obligation, value added tax or any other tax or similar
								obligation or charge as appropriate under applicable law; and
							</ListItem>
							<ListItem>
								(c) SelfKey will not withhold any taxes or amounts from payments
								made through the Portal or via the Portal Services, and you hereby
								indemnify SelfKey for any amounts due or payable to any applicable
								authority (including penalties and interest) so charged because of a
								failure to make a withholding from any payment made to you.
							</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							In the event of any tax or financial audit of SelfKey, if you are a User
							that is a Certifier or Relying Party, you agree to promptly cooperate
							with SelfKey and to provide copies of your tax and other documents as
							may be reasonably requested for purposes of such audit, including but
							not limited to records indicating that you are engaging in an
							independent business within the Portal.
						</Typography>

						<Typography variant="h3" paragraph>
							6) SELFKEY FEES AND PAYMENTS
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 6 describes what fees you agree to pay to SelfKey in
							exchange for SelfKey providing the Portal and Portal Services to you, as
							detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							The Portal and Portal Services may contain advertisements, sponsored
							content, paid insertions, affiliate links or other forms of
							monetization, all of which are subject to change without specific notice
							to you. Any program, product or service that we may promote, market,
							share or sell on or through the Portal or through Portal Services are
							not guaranteed by SelfKey, you agree to do your own independent
							assessment as to their quality, safety or legality within Your
							Jurisdictions.
						</Typography>
						<Typography variant="body2" paragraph>
							If you are a User that is a Certifier or Relying Party, SelfKey may
							charge you a service fee for the use of the Portal and/or Portal
							Services (the {'"'}Service Fees{'"'}), as detailed in the
							Certifier/Relying Party Agreement you entered into with SelfKey.
						</Typography>
						<Typography variant="body2" paragraph>
							Users acknowledge and agree that when a Client pays a Certifier or
							Relying Party for services or a product under a Product/Service
							Agreement, SelfKey will credit the Certifier or Relying Party for the
							full amount paid by the Client, and then subtract and disburse to
							SelfKey any Service Fee.{' '}
						</Typography>

						<Typography variant="h3" paragraph>
							7) RECORDS AND DATA
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 7 discusses the privacy of your information, maintaining
							records and the storage of data, as detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							7.1) Your Personally Identifiable Information
						</Typography>
						<Typography variant="body2" paragraph>
							You acknowledge and agree that your information, including any
							personally identifiable information, shall be handled and processed in
							accordance with our{' '}
							<Link href={'https://selfkey.org/privacy-policy.html'}>
								SelfKey Privacy Policy
							</Link>
							.
						</Typography>
						<Typography variant="body2" paragraph>
							7.2) Records Of Compliance
						</Typography>
						<Typography variant="body2" paragraph>
							Users agree that they shall (a) create and maintain records to document
							satisfaction of their respective obligations under the Terms of Service,
							including, without limitation, their respective payment obligations and
							compliance with tax and employment laws under applicable Product/Service
							Agreements, and (b) provide copies of such records to SelfKey upon
							request. Nothing in this Section requires or will be construed as
							requiring SelfKey to supervise or monitor a User’s compliance with this
							Agreement, the other Terms of Service, or a Product/Service Agreement.
							You are solely responsible for creation, storage, and backup of your
							business records.
						</Typography>
						<Typography variant="body2" paragraph>
							7.3) Data Storage
						</Typography>
						<Typography variant="body2" paragraph>
							7.3.1) By SelfKey
						</Typography>
						<Typography variant="body2" paragraph>
							Personal, non-personal and aggregated data may be stored by SelfKey for
							purposes of product improvement and customer usage analytics in
							accordance with the SelfKey Privacy Policy. User Content may be stored
							by SelfKey in accordance with Section 5.4 herein.
						</Typography>
						<Typography variant="body2" paragraph>
							This Agreement, the Terms of Use, any registration for or subsequent use
							of the Portal or the Portal Services shall not be construed as creating
							any responsibility on SelfKey’s part to store, backup, retain, or grant
							access to any information or data for any period.
						</Typography>
						<Typography variant="body2" paragraph>
							7.3.2) By Other Users or Third Parties
						</Typography>
						<Typography variant="body2" paragraph>
							Data, which may include your personally identifiable information, may be
							stored by Users that are Certifiers or Relying Parties in accordance
							with your Product/Service Agreements with them. Non-personal or
							aggregated data may be stored by third parties for marketing and/or
							analytics in accordance with the SelfKey Privacy Policy.
						</Typography>
						<Typography variant="body2" paragraph>
							7.3.3) On Local Device or Computer
						</Typography>
						<Typography variant="body2" paragraph>
							Data and other information related to your usage of the Wallet Platform,
							such as private keys, seed phrases, addresses or passwords, may be
							stored locally on your mobile device or computer.
						</Typography>
						<Typography variant="body2" paragraph>
							Further, data and other information related to your usage of the
							Marketplace Platform, such as digital copies of any identification
							documents you send to Certifiers, may be stored locally on your mobile
							device or computer.
						</Typography>
						<Typography variant="body2" paragraph>
							You understand and agree that you are solely responsible for
							safeguarding data and all information stored locally on your mobile
							device or computer. Further, you agree that you will not hold SelfKey
							responsible for any consequences due to a loss of such data or
							information, and that your release of liability in Section 10 covers any
							situation in which a loss of local data or information on your mobile
							device or computer occurs.
						</Typography>
						<Typography variant="body2" paragraph>
							SelfKey does not receive nor store Account private keys, seed phrases,
							addresses or passwords. Therefore, we cannot assist you with the
							retrieval of any such information. You acknowledge and agree that you
							should safely store a backup of your Account addresses, private keys and
							seed phrases.
						</Typography>
						<Typography variant="body2" paragraph>
							7.4) Account Data On Closure
						</Typography>
						<Typography variant="body2" paragraph>
							Except as otherwise required by law, if your Account is closed for any
							reason, you will no longer have access to data, messages, files, or
							other material you keep on the Portal and any closure of your Account
							may involve deletion of any content stored in your Account for which
							SelfKey will have no liability whatsoever. SelfKey, in its sole
							discretion and as permitted or required by law, may retain some or all
							of your Account information.
						</Typography>
						<Typography variant="body2" paragraph>
							You acknowledge and agree that the value, reputation, and goodwill of
							the Portal and the Portal Services depend on transparency of User’s
							Account status to all Users, which includes both you and other Users who
							have entered into Product/Service Agreements with you. If SelfKey
							decides to temporarily or permanently close your Account, you
							acknowledge and agree that SelfKey has the fullest right allowed by
							applicable law, but not the obligation to: (a) notify other Users that
							have entered into Product/Service Agreements with you to inform them of
							your closed account status, and (b) provide those Users with a summary
							of the reasons for your account closure. You further agree that SelfKey
							will have no liability arising from or relating to any notice that it
							may provide to any User regarding closed account status or the reason(s)
							for the closure.
						</Typography>

						<Typography variant="h3" paragraph>
							8) DISCLAIMERS; NO WARRANTIES
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 8 discusses your agreement and understanding that SelfKey
							makes certain disclaimers and makes no warranties regarding the Portal
							and Portal Services, as detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							8.1) Disclaimers
						</Typography>
						<Typography variant="body2" paragraph>
							SelfKey disclaims all representations and warranties, whether express,
							implied or statutory including, without limitation: (a) any warranties
							that the Portal or Portal Services are free of viruses, worms, Trojan
							horses or other harmful components; (b) any warranties that the Portal,
							Portal Services or their software codes are error-free or that any such
							defects or errors will be corrected; (c) any warranties that the SelfKey
							Wallet will be compatible with your computer or other electronic
							equipment; and (d) any warranties of non-infringement.{' '}
						</Typography>
						<Typography variant="body2" paragraph>
							YOU AGREE NOT TO RELY ON THE PORTAL, THE PORTAL SERVICES, ANY
							INFORMATION ON THE PORTAL OR THE CONTINUATION OF THE PORTAL. THE PORTAL
							AND THE PORTAL SERVICES ARE PROVIDED {'"'}AS IS{'"'} AND ON AN {'"'}AS
							AVAILABLE{'"'} BASIS.
						</Typography>
						<Typography variant="body2" paragraph>
							8.1) No Warranties
						</Typography>
						<Typography variant="body2" paragraph>
							SELFKEY MAKES NO REPRESENTATIONS OR WARRANTIES WITH REGARD TO THE
							PORTAL, THE PORTAL SERVICES, WORK PRODUCT, USER CONTENT, OR ANY
							ACTIVITIES OR ITEMS RELATED TO THIS AGREEMENT OR THE TERMS OF SERVICE.
							TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SELFKEY DISCLAIMS ALL
							EXPRESS AND IMPLIED CONDITIONS, REPRESENTATIONS, AND WARRANTIES
							INCLUDING, BUT NOT LIMITED TO, THE WARRANTIES OF MERCHANTABILITY,
							ACCURACY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
							SOME JURISDICTIONS MAY NOT ALLOW FOR ALL OF THE FOREGOING LIMITATIONS ON
							WARRANTIES, SO TO THAT EXTENT, SOME OR ALL OF THE ABOVE LIMITATIONS MAY
							NOT APPLY TO YOU.
						</Typography>

						<Typography variant="h3" paragraph>
							9) LIMITATION OF LIABILITY
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 9 discusses your agreement that SelfKey usually will not
							have to pay you damages relating to your use of the Portal and Portal
							Services and, if it is, at most it will be required to pay you a limited
							amount, as detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							SelfKey is not liable, and you agree not to hold us responsible, for any
							damages or losses arising out of or in connection with the Terms of
							Service, including, but not limited to:
						</Typography>
						<List>
							<ListItem>
								(a) your use of or your inability to use our Portal or Portal
								Services;
							</ListItem>
							<ListItem>
								(b) delays or disruptions in our Portal or Portal Services;
							</ListItem>
							<ListItem>
								(c) viruses or other malicious software obtained by accessing, or
								linking to, our Portal or Portal Services;
							</ListItem>
							<ListItem>
								(d) glitches, bugs, errors, or inaccuracies of any kind in our
								Portal or Portal Services;
							</ListItem>
							<ListItem>
								(e) damage to your hardware device from the use of the Portal or
								Portal Services;
							</ListItem>
							<ListItem>
								(f) the content, actions, or inactions of third parties{"'"} use of
								the Portal or Portal Services;
							</ListItem>
							<ListItem>
								(g) a suspension or other action taken with respect to your Account;
							</ListItem>
							<ListItem>
								(h) your reliance on the quality, accuracy, or reliability of User
								Content, including, without limitation, Profiles, ratings,
								recommendations, metrics and feedback (including their content,
								order, and display) found on, used on, or made available through the
								Portal;
							</ListItem>
							<ListItem>
								(i) your need to modify practices, content, or behavior or your loss
								of or inability to do business, as a result of changes to the Terms
								of Service;
							</ListItem>
							<ListItem>
								(j) any loss due to your use of the Wallet Platform; and
							</ListItem>
							<ListItem>
								(k) any loss due to your use of the Marketplace Platform.
							</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							ADDITIONALLY, IN NO EVENT WILL SELFKEY, OUR AFFILIATES, OUR LICENSORS,
							OR OUR THIRD-PARTY SERVICE PROVIDERS BE LIABLE FOR ANY SPECIAL,
							CONSEQUENTIAL, INCIDENTAL, PUNITIVE, EXEMPLARY, OR INDIRECT COSTS OR
							DAMAGES, INCLUDING, BUT NOT LIMITED TO, LITIGATION COSTS, INSTALLATION
							AND REMOVAL COSTS, OR LOSS OF DATA, PRODUCTION, PROFIT, OR BUSINESS
							OPPORTUNITIES.
						</Typography>
						<Typography variant="body2" paragraph>
							THE LIABILITY OF SELFKEY, OUR AFFILIATES, OUR LICENSORS, AND OUR
							THIRD-PARTY SERVICE PROVIDERS TO ANY USER FOR ANY CLAIM ARISING OUT OF
							OR IN CONNECTION WITH THIS AGREEMENT OR THE OTHER TERMS OF SERVICE WILL
							NOT EXCEED THE LESSER OF: (A) USD$50; OR (B) ANY SERVICE FEES RETAINED
							BY SELFKEY WITH RESPECT TO PRODUCT/SERVICE AGREEMENTS WITH WHICH USER
							WAS INVOLVED DURING THE THREE-MONTH PERIOD PRECEDING THE DATE OF THE
							CLAIM.
						</Typography>
						<Typography variant="body2" paragraph>
							ALL LIMITATIONS WILL APPLY TO ANY LIABILITY, ARISING FROM ANY CAUSE OF
							ACTION WHATSOEVER ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT OR
							THE OTHER TERMS OF SERVICE, WHETHER IN CONTRACT, EQUITY, TORT (INCLUDING
							NEGLIGENCE), STRICT LIABILITY, OR OTHERWISE, EVEN IF ADVISED OF THE
							POSSIBILITY OF SUCH COSTS OR DAMAGES AND EVEN IF THE LIMITED REMEDIES
							PROVIDED HEREIN FAIL OF THEIR ESSENTIAL PURPOSE. SOME JURISDICTIONS DO
							NOT ALLOW FOR ALL OF THE FOREGOING EXCLUSIONS AND LIMITATIONS, SO TO
							THAT EXTENT, SOME OR ALL OF THESE LIMITATIONS AND EXCLUSIONS MAY NOT
							APPLY TO YOU.
						</Typography>

						<Typography variant="h3" paragraph>
							10) RELEASE
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 10 discusses your agreement not to hold us responsible for
							any dispute you may have with another User, or for any loss due to your
							use of the Wallet Platform, as detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							You hereby release SelfKey, our affiliated Business Organizations and
							persons, and our respective officers, directors, agents, subsidiaries,
							joint ventures, employees and service providers from claims, demands,
							and damages (actual and consequential) of every kind and nature, known
							and unknown, whether it be at law or in equity, existing as of the time
							you enter into this Agreement, arising out of or in any way connected
							with:
						</Typography>
						<List>
							<ListItem>(a) any dispute you have with another User;</ListItem>
							<ListItem>(b) your use of the Wallet Platform; or</ListItem>
							<ListItem>(c) your use of the Marketplace Platform.</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							This release includes, for example and without limitation, any disputes
							regarding the performance, functions, and quality of the services or
							products provided under a Product/Service Agreement, requests for
							refunds based upon such disputes, claims of losses due to your
							management of Digital Assets using the Wallet Platform, and claims of
							losses due to one or more Product/Service Agreements.
						</Typography>

						<Typography variant="h3" paragraph>
							11) INDEMNIFICATION
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 11 discusses your agreement to pay for any costs or losses
							we have as a result of a claim brought against us related to your use of
							the Portal or Portal Services or your illegal or harmful conduct, as
							detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							You will indemnify, defend, and hold harmless SelfKey, our affiliated
							Business Organizations and persons, and our respective directors,
							officers, employees, representatives, and agents (each an {'"'}
							Indemnified Party{'"'}) for all Indemnified Claims (defined below) and
							Indemnified Liabilities (defined below) relating to or arising out of:
							(a) the downloading or the use of the Portal and the Portal Services by
							you or your agents, including the Wallet Platform and the Marketplace
							Platform; (b) the breach of any legal obligations, including any payment
							obligations or default incurred through one or more Product/Service
							Agreements; (c) the User Content of any User, including you, that is
							developed, provided, or otherwise related to your use of the Portal
							Services; (d) any Product/Service Agreement entered into by you or your
							agents, including, but not limited to, the classification of a Certifier
							or Relying Party as an independent contractor, the classification of
							SelfKey as an employer or joint employer of Certifier or Relying Party,
							any employment-related claims, such as those relating to employment
							termination, employment discrimination, harassment, or retaliation, and
							any claims for unpaid wages or other compensation, overtime pay, sick
							leave, holiday or vacation pay, retirement benefits, worker’s
							compensation benefits, unemployment benefits, or any other employee
							benefits; (e) failure to comply with the Terms of Service by you or your
							agents; (g) failure to comply with the laws and regulations in Your
							Jurisdictions by you or your agents; (g) negligence, willful misconduct,
							or fraud by you or your agents; and (h) the violation of any rights of
							any other person or entity, including, without limitation, defamation,
							libel, violation of privacy rights, unfair competition, or infringement
							of intellectual property rights or allegations.{' '}
						</Typography>
						<Typography variant="body2" paragraph>
							For purposes of this Section 11, your agents include any person who has
							apparent authority to access or use your account demonstrated by using
							your password.
						</Typography>
						<Typography variant="body2" paragraph>
							{'"'}Indemnified Claim{'"'} means any and all claims, damages,
							liabilities, costs, losses, and expenses (including reasonable
							attorneys’ fees and all related costs and expenses) arising from or
							relating to any claim, suit, proceeding, demand, or action brought by
							you or a third party or other User against an Indemnified Party.
						</Typography>
						<Typography variant="body2" paragraph>
							{'"'}Indemnified Liability{'"'} means any and all claims, damages,
							liabilities, costs, losses, and expenses (including reasonable
							attorneys’ fees and all related costs and expenses) arising from or
							relating to any claim, suit, proceeding, demand, or action brought by an
							Indemnified Party against you or a third party or other User.
						</Typography>

						<Typography variant="h3" paragraph>
							12) AGREEMENT TERM AND TERMINATION
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 12 discusses your and SelfKey’s agreement about when and
							how long this Agreement will last, when and how either you or SelfKey
							can end this Agreement, and what happens if either of us ends the
							Agreement, as detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							12.1) Termination
						</Typography>
						<Typography variant="body2" paragraph>
							Unless both you and SelfKey expressly agree otherwise in writing, either
							of us may terminate this Agreement in our sole discretion, at any time,
							without explanation, upon written notice to the other, which will result
							in the termination of the other Terms of Service as well, except as
							otherwise provided herein. You may provide notice to legal@selfkey.org.
							In the event you properly terminate this Agreement, you agree to
							immediately cease use of the Portal and Portal Services, and further
							agree and understand that your Account will be closed.{' '}
						</Typography>
						<Typography variant="body2" paragraph>
							SelfKey is not a party to any Product/Service Agreement between Users.
							Consequently, User understands and acknowledges that termination of this
							Agreement (or attempt to terminate this Agreement) does not terminate or
							otherwise impact any Product/Service Agreement entered into between
							Users. If you attempt to terminate this Agreement while you are still a
							party to one or more active Product/Service Agreements, you agree that:
						</Typography>
						<List>
							<ListItem>
								(a) you will continue to be bound by this Agreement and to the other
								Terms of Service until all such Product/Service Agreements have been
								concluded;
							</ListItem>
							<ListItem>
								(b) SelfKey will continue to utilize the Portal and Portal Services
								features necessary to complete such Product/Service Agreements or
								related transaction between you and another User; and
							</ListItem>
							<ListItem>
								(c) you will continue to be obligated to pay any amounts accrued but
								unpaid as of the date of termination or as of the conclusion of any
								such Product/Service Agreements, whichever is later, including those
								to SelfKey or such other amounts owed under the Terms of Service or
								any Product/Service Agreement.
							</ListItem>
						</List>
						<Typography variant="body2" paragraph>
							Without limiting SelfKey’s other rights or remedies, we may, but are not
							obligated to, temporarily or indefinitely revoke or limit access to the
							Portal or Portal Services, deny your registration, or permanently revoke
							your access to the Portal and refuse to provide any or all Portal
							Services to you if: (x) you breach the letter or spirit of any terms and
							conditions of this Agreement or any other provisions of the Terms of
							Service; (y) we suspect or become aware that you have provided false or
							misleading information to us; or (z) we believe, in our sole discretion,
							that your actions may cause legal liability for you, our Users, or
							SelfKey or our affiliated Business Organizations and persons, may be
							contrary to the interests of the Portal or the User community, or may
							involve illicit or illegal activity.
						</Typography>
						<Typography variant="body2" paragraph>
							If your Account is temporarily or permanently closed, you may not use
							the Portal under the same Account or a different Account or reregister
							under a new Account without SelfKey’s prior written consent. If you
							attempt to use the Portal under a different Account, we reserve the
							right to reclaim available funds in that Account to pay for any amounts
							owed by you to the extent permitted by applicable law.
						</Typography>
						<Typography variant="body2" paragraph>
							12.2) Survival
						</Typography>
						<Typography variant="body2" paragraph>
							After this Agreement terminates, the terms of this Agreement and the
							other Terms of Service that expressly or by their nature contemplate
							performance after this Agreement terminates or expires will survive and
							continue in full force and effect. For example, the provisions
							permitting audits, protecting intellectual property, requiring
							indemnification, requiring payment of fees, and setting forth
							limitations of liability each, by their nature, contemplate performance
							or observance after this Agreement terminates. Without limiting any
							other provisions of the Terms of Service, the termination of this
							Agreement for any reason will not release you or SelfKey from any
							obligations incurred prior to termination of this Agreement or that
							thereafter may accrue in respect of any act or omission prior to such
							termination.
						</Typography>

						<Typography variant="h3" paragraph>
							13) GENERAL
						</Typography>
						<Typography variant="body2" paragraph>
							This Section 13 discusses additional terms of the Agreement between you
							and SelfKey, including how the Agreement will be interpreted and
							applied, as detailed below.
						</Typography>
						<Typography variant="body2" paragraph>
							13.1) Entire Agreement
						</Typography>
						<Typography variant="body2" paragraph>
							This Agreement, together with the other Terms of Service, sets forth the
							entire agreement and understanding between you and SelfKey relating to
							the subject matter hereof and thereof and cancels and supersedes any
							prior or contemporaneous discussions, agreements, representations,
							warranties, and other communications between you and us, written or
							oral, to the extent they relate in any way to the subject matter hereof
							and thereof. The section headings in the Terms of Service are included
							for ease of reference only and have no binding effect. Even though
							SelfKey drafted the Terms of Service, you represent that you had ample
							time to review and decide whether to agree to the Terms of Service. If
							an ambiguity or question of intent or interpretation of the Terms of
							Service arises, no presumption or burden of proof will arise favoring or
							disfavoring you or SelfKey because of the authorship of any provision of
							the Terms of Service.
						</Typography>
						<Typography variant="body2" paragraph>
							13.2) Modifications; Waiver
						</Typography>
						<Typography variant="body2" paragraph>
							No modification or amendment to the Terms of Service will be binding
							upon SelfKey unless they are agreed in a written instrument signed by a
							duly authorized representative of SelfKey or posted on the Portal by
							SelfKey. Our failure to act with respect to a breach by you or others
							does not waive our right to act with respect to subsequent or similar
							breaches. We do not guarantee we will take action against all breaches
							of this Agreement.
						</Typography>
						<Typography variant="body2" paragraph>
							13.3) Governing Law; Jurisdiction; Venue
						</Typography>
						<Typography variant="body2" paragraph>
							This Agreement, the other Terms of Service, and any claim will be
							governed by and construed in accordance with the laws of the Federation
							of Saint Christopher/St. Kitts and Nevis, without regard to its conflict
							of law provisions. You hereby submit to and consent to the exclusive
							jurisdiction and venue of the courts sitting in the Federation of Saint
							Christopher/St. Kitts and Nevis for the litigation of any dispute
							hereunder or in connection with the Terms of Service, the Portal or the
							Portal Services. You hereby irrevocably waive, and agree not to assert
							in any suit, action or proceeding, any claim that (a) you are not
							personally subject to the jurisdiction of such courts, or (b) such suit,
							action or proceeding is brought in an inconvenient forum, or (c) the
							venue of such suit, action or proceeding is improper.
						</Typography>
						<Typography variant="body2" paragraph>
							13.4) Class And Collective Waiver
						</Typography>
						<Typography variant="body2" paragraph>
							Both you and SelfKey agree to bring any claim or dispute on an
							individual basis only, and not on a class or collective basis on behalf
							of others. There will be no right or authority for any dispute to be
							brought, heard or litigated as a class or collective action, or as a
							member in any such class or collective proceeding.
						</Typography>
						<Typography variant="body2" paragraph>
							13.5) Assignability
						</Typography>
						<Typography variant="body2" paragraph>
							User may not assign the Terms of Service, or any of its rights or
							obligations hereunder, without SelfKey’s prior written consent in the
							form of a written instrument signed by a duly authorized representative
							of SelfKey. SelfKey may freely assign this Agreement and the other Terms
							of Service without User’s consent. Any attempted assignment or transfer
							in violation of this subsection will be null and void. Subject to the
							foregoing restrictions, the Terms of Service are binding upon and will
							inure to the benefit of the successors, heirs, and permitted assigns of
							the parties.
						</Typography>
						<Typography variant="body2" paragraph>
							13.6) Severability; Interpretation
						</Typography>
						<Typography variant="body2" paragraph>
							If and to the extent any provision of this Agreement or the other Terms
							of Service is held illegal, invalid, or unenforceable in whole or in
							part under applicable law, such provision or such portion thereof will
							be ineffective as to the jurisdiction in which it is illegal, invalid,
							or unenforceable to the extent of its illegality, invalidity, or
							unenforceability and will be deemed modified to the extent necessary to
							conform to applicable law so as to give the maximum effect to the intent
							of the parties. The illegality, invalidity, or unenforceability of such
							provision in that jurisdiction will not in any way affect the legality,
							validity, or enforceability of such provision in any other jurisdiction
							or of any other provision in any jurisdiction.
						</Typography>
						<Typography variant="body2" paragraph>
							13.7) Force Majeure
						</Typography>
						<Typography variant="body2" paragraph>
							We will not be responsible for the failure to perform, or any delay in
							performance of, any obligation hereunder for a reasonable period due to
							pandemics, accidents, fires, floods, telecommunications or Internet
							failures, strikes, wars, riots, rebellions, blockades, acts of
							government, governmental requirements and regulations or restrictions
							imposed by law or any other conditions beyond our reasonable control.
						</Typography>
						<Typography variant="body2" paragraph>
							13.8) Prevailing Language
						</Typography>
						<Typography variant="body2" paragraph>
							The English language version of the Agreement will be controlling in all
							respects and will prevail in case of inconsistencies with translated
							versions, if any.
						</Typography>
						<Typography variant="body2" paragraph>
							13.9) Consent To Use Electronic Records
						</Typography>
						<Typography variant="body2" paragraph>
							It may be mandated or desirable that you receive certain records in
							writing from SelfKey, our affiliated Business Organizations and persons,
							and from other Users, including contracts, notices, and communications.
							To facilitate your use of the Portal and the Portal Services, you grant
							permission to receive these records to you electronically instead of in
							paper form. You further agree to utilize electronic signatures in lieu
							of using paper documents, and you understand and agree that electronic
							signatures are equivalent to traditional signatures, and equally
							binding.
						</Typography>
						<Typography variant="body2" paragraph>
							13.10) Copyright {'&'} Trademark Rights
						</Typography>
						<Typography variant="body2" paragraph>
							The SelfKey name and logo, the Portal, and the Portal Services are all
							property of SelfKey. Other trade names, trademarks, and product names
							used on the Portal or with the Portal Services are the property of their
							respective owners. All images, graphics, text and other content used in
							connection with the Portal and Portal Services are protected by
							trademark, copyright and other proprietary laws and treaty provisions.
							Nothing in this Agreement or the Terms of Service grants you a right to
							use the intellectual property of SelfKey or of any other User.
						</Typography>

						<Typography variant="h3" paragraph>
							14) CRASH REPORT &#38; ANALYTICS
						</Typography>
						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.crashReportAgreement}
									onChange={this.toogleCrashReportAgreement}
								/>
							}
							label="You agree to share basic data and analytics to help SelfKey improve the SelfKey wallet application. This information is non-personal identifiable information, and limited to general usage of wallet, (for example, where a user got stuck in a purchasing process)"
						/>
					</Grid>
					<Grid item>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							spacing={3}
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
			</Popup>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Terms));
