import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { push } from 'connected-react-router';
import {
	MarketplaceIcon,
	DropdownIcon,
	BankRoundedIcon,
	IncorporationsRoundedIcon,
	ExchangeRoundedIcon
} from 'selfkey-ui';
import { kycSelectors, kycOperations } from '../../common/kyc';
import HeaderIcon from '../common/header-icon';

const styles = theme => ({
	allApplications: {
		justifyContent: 'center',
		marginTop: theme.spacing(2)
	},
	applicationIcon: {
		marginRight: theme.spacing(2)
	},
	applicationRecord: {
		alignItems: 'center',
		borderBottom: '1px solid #475768',
		display: 'flex',
		padding: theme.spacing(2, 0),
		'& h6:first-child': {
			marginBottom: '4px'
		}
	},
	applicationStatus: {
		alignItems: 'center',
		display: 'flex'
	},
	bgIcon: {
		top: '39px',
		marginTop: '-112px',
		opacity: '0.5',
		position: 'relative',
		right: '-520px',
		zIndex: 0
	},
	bottomSpace: {
		marginBottom: theme.spacing(5)
	},
	btnText: {
		fontWeight: 'normal',
		marginLeft: theme.spacing(1)
	},
	dmaWrap: {
		backgroundColor: '#262F39',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		height: '100%',
		overflow: 'hidden',
		padding: theme.spacing(3, 4, 4)
	},
	flex: {
		display: 'flex'
	},
	flexColumn: {
		flexDirection: 'column'
	},
	justifySpaceBetween: {
		justifyContent: 'space-between'
	},
	rightSpace: {
		marginRight: theme.spacing(1)
	},
	title: {
		fontSize: '20px',
		marginBottom: theme.spacing(2)
	},
	iconMargin: {
		marginRight: theme.spacing(1)
	},
	'@media screen and (min-width: 1230px)': {
		bgIcon: {
			right: '-559px'
		}
	}
});

const EmptyState = ({ classes, route }) => (
	<>
		<Typography variant="body2" className={classes.bottomSpace}>
			You {"haven't"} applied for any service in the Marketplace
		</Typography>
		<Button variant="outlined" size="large" onClick={route}>
			Discover the marketplace
		</Button>
		<div className={classes.bgIcon}>
			<MarketplaceIcon width="135px" height="110px" fill="#313B49" />
		</div>
	</>
);

const getAbrDateFromTimestamp = timestamp => {
	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const leadingZero = num => `0${num}`.slice(-2);
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = monthNames[date.getMonth()];
	const day = date.getDate();
	const hours = leadingZero(date.getHours());
	const minutes = leadingZero(date.getMinutes());
	return { year, month, day, hours, minutes };
};

const RenderDate = ({ timestamp }) => {
	const { year, month, day } = getAbrDateFromTimestamp(timestamp);
	return (
		<>
			{day} {month} {year}
		</>
	);
};

const ApplicationIcon = ({ classes, title }) => {
	if (title.toLowerCase().includes('incorporate')) {
		return (
			<div className={classes.applicationIcon}>
				<IncorporationsRoundedIcon />
			</div>
		);
	} else if (title.toLowerCase().includes('bank account')) {
		return (
			<div className={classes.applicationIcon}>
				<BankRoundedIcon />
			</div>
		);
	} else {
		return (
			<div className={classes.applicationIcon}>
				<ExchangeRoundedIcon />
			</div>
		);
	}
};

const ApplicationsList = ({ classes, route, applications }) => (
	<>
		<div className={`${classes.flex} ${classes.flexColumn}`}>
			{applications.slice(0, 3).map(application => {
				return (
					<div
						key={application.id}
						className={`${classes.applicationRecord} ${classes.justifySpaceBetween}`}
					>
						<div className={classes.flex} style={{ alignItems: 'center' }}>
							<ApplicationIcon classes={classes} title={application.title} />
							<div className="application-type">
								<Typography variant="h6">{application.title}</Typography>
								<Typography variant="subtitle2" color="secondary">
									<RenderDate timestamp={application.applicationDate} />
								</Typography>
							</div>
						</div>
						<div className={classes.applicationStatus}>
							<div className={classes.iconMargin}>
								<HeaderIcon status={application.currentStatus} />
							</div>
							<Typography variant="h6">{application.currentStatusName}</Typography>
						</div>
					</div>
				);
			})}
		</div>
		<div className={`${classes.flex} ${classes.allApplications}`}>
			<Button onClick={route}>
				<DropdownIcon width="18px" height="10px" />
				<Typography variant="overline" className={classes.btnText} color="secondary">
					View All Applications
				</Typography>
			</Button>
		</div>
	</>
);

class DashboardMarketplaceApplications extends PureComponent {
	marketplaceRoute = () => {
		this.props.dispatch(push('marketplace'));
	};

	applicationsRoute = () => {
		this.props.dispatch(push('/main/selfkeyIdApplications'));
	};

	async componentDidMount() {
		const { dispatch } = this.props;
		await dispatch(kycOperations.loadApplicationsOperation());
	}

	render() {
		const { classes, applications } = this.props;
		const isEmpty = applications.length < 1;
		return (
			<Grid item className={classes.dmaWrap}>
				<Typography variant="h1" className={classes.title}>
					Marketplace Applications
				</Typography>
				{isEmpty && isEmpty ? (
					<EmptyState classes={this.props.classes} route={this.marketplaceRoute} />
				) : (
					<ApplicationsList
						classes={this.props.classes}
						route={this.applicationsRoute}
						applications={applications}
					/>
				)}
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		applications: kycSelectors.selectApplications(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(DashboardMarketplaceApplications));
