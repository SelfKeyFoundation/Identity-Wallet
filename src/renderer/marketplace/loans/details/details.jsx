import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import { UserPlusIcon, primary, /* CalendarDepositIcon, */ typography } from 'selfkey-ui';
import { MarketplaceDisclaimer } from '../../common/disclaimer';
import { Grid, Button, Typography } from '@material-ui/core';
import { LoansDetailsTabs } from './details-tabs';
// import { Grid, Divider, FormGroup, FormControl, Button, Typography } from '@material-ui/core';
// import { push } from 'connected-react-router';
import {
	APPLICATION_REJECTED,
	APPLICATION_CANCELLED,
	APPLICATION_APPROVED,
	APPLICATION_UPLOAD_REQUIRED,
	APPLICATION_ANSWER_REQUIRED
} from 'common/kyc/status_codes';

const styles = theme => ({
	root: {
		width: '946px',
		height: '100%',
		margin: '50px auto 30px',
		borderRadius: '4px',
		'@media screen and (min-width: 1230px)': {
			width: '1140px'
		}
	},

	title: {
		margin: '20px 20px 20px 7px'
	},

	header: {
		backgroundColor: '#2a3540',
		border: '1px solid #303C49',
		borderRadius: '4px 4px 0 0',
		'& img': {
			maxWidth: '40px',
			height: 'auto'
		}
	},

	body: {
		backgroundColor: '#262F39',
		border: '1px solid #303C49',
		borderRadius: '0 0 4px 4px',
		borderTop: 0,
		color: '#fff',
		fontFamily: 'Lato, arial, sans-serif',
		fontSize: '16px',
		fontWeight: 400,
		lineHeight: 1.67,
		margin: 0,
		padding: '44px 30px 16px',
		textAlign: 'justify',
		width: '100%'
	},

	formControl: {
		marginRight: '100px',
		maxWidth: '45%'
	},

	divider: {
		backgroundColor: '#475768'
	},

	dividerWrapper: {
		width: '100%'
	},

	fullWidth: {
		width: '100%'
	},

	formGroup: {
		backgroundColor: 'transparent',
		'& h5': {
			marginRight: '1em'
		},
		'& span': {
			fontSize: '14px',
			lineHeight: '35px',
			'& h5': {
				display: 'inline'
			},
			'& p': {
				display: 'inline'
			}
		},

		'& span strong': {
			fontSize: '16px'
		}
	},

	bullet: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '30px',
		height: '28px',
		borderRadius: '18px',
		backgroundColor: '#3b4b59',
		border: 'solid 1px #495b70'
	},

	description: {
		marginTop: 0,
		textAlign: 'left',
		maxWidth: '620px'
	},

	buttonWrapper: {
		marginRight: '30px'
	},

	button: {
		color: '#93b0c1',
		border: '1px solid #3b4a5a',
		fontWeight: 400,
		'&:disabled': {
			color: '#48565f'
		}
	},

	buttonDescription: {
		fontSize: '12px',
		width: '100%'
	},

	requirementListItem: {
		columnBreakInside: 'avoid',
		color: '#93b0c1'
	},

	requirementList: {
		columnCount: 2
	},

	notEnteredRequeriment: {
		height: '28px',
		width: '30px',
		borderRadius: '18px',
		backgroundColor: '#F5A623'
	},

	bold: {
		fontWeight: 600
	},

	backButtonContainer: {
		left: '75px',
		position: 'absolute',
		top: '120px'
	},

	providerDescription: {
		marginBottom: '20px',
		textAlign: 'left',
		marginRight: '55px'
	},

	exchange: {
		paddingTop: '3px'
	},
	strong: {
		fontWeight: '600'
	},
	ctaButton: {
		marginBottom: '15px',
		width: '100%'
	},
	pendingApprovalButton: {
		height: 'initial',
		marginBottom: '15px',
		opacity: '1 !important',
		padding: '6px 0',
		'& span': {
			display: 'flex',
			justifyContent: 'space-around'
		}
	},
	signUpButton: {
		display: 'flex',
		justifyContent: 'space-between',
		maxWidth: '100%',
		marginLeft: 'auto',
		marginRight: '0'
	},
	ctaArea: {
		'& div': {
			// marginTop: '1em'
		},
		'& div h3': {
			textAlign: 'left',
			fontSize: '13px',
			lineHeight: '18px'
		}
	},
	topSpace: {
		marginTop: '15px'
	},
	link: {
		color: primary,
		cursor: 'pointer',
		textDecoration: 'none'
	},
	pending: {
		color: primary,
		fontSize: '16px !important',
		textTransform: 'uppercase'
	},
	pendingSubtitle: {
		color: typography,
		fontSize: '13px !important',
		fontWeight: 400,
		marginTop: '-6px',
		textTransform: 'initial'
	},
	kyc: {
		'& div:first-child': {
			marginTop: 0
		}
	},
	icon: {
		alignItems: 'center',
		display: 'flex',
		height: '44px',
		marginLeft: '22px'
	},
	defaultIcon: {
		alignItems: 'center',
		borderRadius: '8px',
		color: '#FFFFFF',
		display: 'flex',
		justifyContent: 'center',
		maxWidth: '44px',
		padding: '0 8px'
	},
	generatedIcon: {
		height: 'inherit',
		maxWidth: '28px',
		width: '44px'
	},
	disclaimer: {
		margin: '20px auto',
		textAlign: 'center',
		maxWidth: '80%'
	},
	affiliateMessage: {
		textAlign: 'left'
	}
});

const linkToExternalUrl = url => window.openExternal(null, url);

const ProviderLinkButton = withStyles(styles)(
	({ classes, url, isAffiliate = false, text = 'SIGN UP' }) => (
		<React.Fragment>
			<Button
				variant="contained"
				size="large"
				className={`${classes.signUpButton} ${classes.ctaButton}`}
				onClick={() => linkToExternalUrl(url)}
			>
				<UserPlusIcon />
				<span>{text}</span>
				<span />
			</Button>
			{isAffiliate && (
				<Typography
					className={classes.affiliateMessage}
					variant="subtitle2"
					color="secondary"
					gutterBottom
				>
					Disclosure: The button above is an affiliate link, we may receive a commission
					for purchases made through this link.
				</Typography>
			)}
		</React.Fragment>
	)
);

const LoanApplyButton = withStyles(styles)(({ classes, application, onClick }) => (
	<React.Fragment>
		<Button
			disabled={
				// Disabled as we don't have any Providers integrated yet
				true ||
				(application &&
					[APPLICATION_REJECTED, APPLICATION_CANCELLED].includes(
						application.currentStatus
					))
			}
			variant="contained"
			size="large"
			className={`${classes.signUpButton} ${classes.ctaButton}`}
			onClick={onClick}
		>
			<span>Apply</span>
		</Button>
	</React.Fragment>
));

const RelyingPartyLinkButton = withStyles(styles)(({ classes, onClick }) => (
	<React.Fragment>
		<Button variant="contained" size="large" className={classes.ctaButton} onClick={onClick}>
			COMPLETE REQUIREMENTS
		</Button>
		<div>
			<Typography variant="h3" gutterBottom>
				After clicking the button above, you will be redirected to a web page to complete
				the KYC requirements needed
			</Typography>
		</div>
	</React.Fragment>
));

class LoansDetailsComponent extends PureComponent {
	state = {
		tab: 'highlights'
	};

	onTabChange = tab => this.setState({ tab });

	async componentDidMount() {
		window.scrollTo(0, 0);
	}

	linkToRelyingParty = () => {
		const { relyingParty } = this.props;
		const url = new URL(relyingParty.session.ctx.config.rootEndpoint);
		return linkToExternalUrl(`https://${url.hostname}`);
	};

	linkToServiceProvider = () => {
		const { item } = this.props;
		return window.openExternal(null, item.URL);
	};

	renderActionButton = item => {
		const { application } = this.props;
		const url = item.data.affiliateUrl ? item.data.affiliateUrl : item.data.url;

		if (!this.props.relyingParty) {
			return url ? (
				<ProviderLinkButton url={url} isAffiliate={!!item.data.affiliateUrl} />
			) : null;
		} else if (
			!application ||
			[APPLICATION_REJECTED, APPLICATION_CANCELLED].includes(application.currentStatus)
		) {
			return <LoanApplyButton application={application} onClick={this.handleSignup} />;
		} else if (
			application.currentStatus === APPLICATION_UPLOAD_REQUIRED ||
			application.currentStatus === APPLICATION_ANSWER_REQUIRED
		) {
			return <RelyingPartyLinkButton onClick={this.linkToRelyingParty} />;
		} else if (application.currentStatus === APPLICATION_APPROVED) {
			return (
				<ProviderLinkButton
					url={url}
					isAffiliate={!!item.data.affiliateUrl}
					text="ACCESS YOUR ACCOUNT"
				/>
			);
		} else {
			// return this.renderPendingApplication();
			return null;
		}
	};

	render() {
		// const { classes, item, backAction, relyingPartyName, templates } = this.props;
		const { classes, item, backAction } = this.props;

		if (!item) {
			return null;
		}

		return (
			<Grid container>
				<Grid item>
					<div className={classes.backButtonContainer}>
						<Button
							variant="outlined"
							color="secondary"
							size="small"
							onClick={backAction}
						>
							<Typography
								variant="subtitle2"
								color="secondary"
								className={classes.bold}
							>
								‹ Back
							</Typography>
						</Button>
					</div>
				</Grid>
				<Grid container className={classes.root}>
					<Grid
						container
						id="header"
						direction="row"
						justify="flex-start"
						alignItems="center"
						className={classes.header}
					>
						<Grid item id="icon" className={classes.icon}>
							<img src={item.data.logoUrl} />
						</Grid>
						<Grid item id="title" className={classes.title}>
							<Grid container alignItems="center">
								<Typography variant="h1">{item.name}</Typography>
								<Typography variant="h1">&nbsp;</Typography>
								<Typography
									variant="subtitle2"
									color="secondary"
									className={classes.exchange}
								>
									- {item.data.type}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item id="body" className={classes.body}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							style={{ width: '100%' }}
						>
							<Grid item id="description" className={classes.fullWidth}>
								<Grid
									container
									direction="row"
									justify="space-between"
									alignItems="flex-start"
									spacing={7}
								>
									<Grid item xs={8}>
										<Typography
											variant="body1"
											className={classes.providerDescription}
										>
											{item.description}
										</Typography>
									</Grid>
									<Grid item xs={4} className={classes.ctaArea}>
										{this.renderActionButton(item)}
									</Grid>
								</Grid>
							</Grid>
							<Grid item id="highlights" className={classes.fullWidth}>
								<LoansDetailsTabs
									item={item}
									tab={this.state.tab}
									onTabChange={this.onTabChange}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} alignItems="center">
						<div className={classes.disclaimer}>
							<MarketplaceDisclaimer />
						</div>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const LoansDetails = withStyles(styles)(LoansDetailsComponent);

export default LoansDetails;
