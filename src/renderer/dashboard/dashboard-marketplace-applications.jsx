import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { MarketplaceIcon, DropdownIcon, BankRoundedIcon, CheckMaIcon } from 'selfkey-ui';
import { kycSelectors } from '../../common/kyc';

const styles = theme => ({
	allApplications: {
		justifyContent: 'center',
		marginTop: '16px'
	},
	applicationRecord: {
		alignItems: 'center',
		borderBottom: '1px solid #475768',
		display: 'flex',
		padding: '16px 0',
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
		marginBottom: '40px'
	},
	dmaWrap: {
		backgroundColor: '#262F39',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		height: '100%',
		overflow: 'hidden',
		padding: '18px 30px 24px'
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
		marginRight: '10px'
	},
	title: {
		fontSize: '20px',
		marginBottom: '17px',
		marginTop: '5px'
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

const ApplicationsList = ({ classes, route }) => (
	<>
		<div className={`${classes.flex} ${classes.flexColumn}`}>
			<div className={`${classes.applicationRecord} ${classes.justifySpaceBetween}`}>
				<div className={classes.flex} style={{ alignItems: 'center' }}>
					<div style={{ marginRight: '14px' }}>
						<BankRoundedIcon />
					</div>
					<div className="application-type">
						<Typography variant="h6">Open Bank Account</Typography>
						<Typography variant="subtitle2" color="secondary">
							27 Jun 2018
						</Typography>
					</div>
				</div>
				<div className={classes.applicationStatus}>
					<CheckMaIcon className={classes.rightSpace} />
					<Typography>Approved</Typography>
				</div>
			</div>

			<div className={`${classes.applicationRecord} ${classes.justifySpaceBetween}`}>
				<div className={classes.flex} style={{ alignItems: 'center' }}>
					<div style={{ marginRight: '14px' }}>
						<BankRoundedIcon />
					</div>
					<div className="application-type">
						<Typography variant="h6">Open Bank Account</Typography>
						<Typography variant="subtitle2" color="secondary">
							27 Jun 2018
						</Typography>
					</div>
				</div>
				<div className={classes.applicationStatus}>
					<CheckMaIcon className={classes.rightSpace} />
					<Typography>Approved</Typography>
				</div>
			</div>

			<div className={`${classes.applicationRecord} ${classes.justifySpaceBetween}`}>
				<div className={classes.flex} style={{ alignItems: 'center' }}>
					<div style={{ marginRight: '14px' }}>
						<BankRoundedIcon />
					</div>
					<div className="application-type">
						<Typography variant="h6">Open Bank Account</Typography>
						<Typography variant="subtitle2" color="secondary">
							27 Jun 2018
						</Typography>
					</div>
				</div>
				<div className={classes.applicationStatus}>
					<CheckMaIcon className={classes.rightSpace} />
					<Typography>Approved</Typography>
				</div>
			</div>
		</div>
		<div className={`${classes.flex} ${classes.allApplications}`}>
			<Button onClick={route}>
				<DropdownIcon />
				<Typography variant="overline" style={{ fontWeight: 'normal' }} color="secondary">
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
					<ApplicationsList classes={this.props.classes} route={this.applicationsRoute} />
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
