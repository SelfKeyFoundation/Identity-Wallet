import React, { Component } from 'react';
import { createStyles, withStyles, Button, Grid, Typography } from '@material-ui/core';
import { MenuNewIcon, DropdownIcon, RoundCompany, RoundPerson } from 'selfkey-ui';
import PriceBox from '../../price-box';
import Sidebar from './sidebar';
import config from 'common/config';

const styles = theme => ({
	wrapper: {
		backgroundColor: '#27333D',
		boxShadow:
			'inset 0 -1px 0 0 #475768, 1px 0 0 0 rgba(118,128,147,0.2), 2px 0 2px 0 rgba(0,0,0,0.2)',
		padding: '0 2%',
		position: 'fixed',
		zIndex: 1
	},
	logo: {
		width: '38px',
		height: '44px',
		marginLeft: '20px',
		cursor: 'pointer',
		transition: '1.0s',
		'-webkit-transition': '1.0s',
		'&:hover': {
			transition: '1.0s',
			'-webkit-transition': '1.0s',
			transform: 'rotate(90deg)',
			'-webkit-transform': 'rotate(90deg)'
		}
	},
	link: {
		outline: 'none',
		'&:focus': {
			outline: 'none'
		}
	},
	menuIcon: {
		'&:hover': {
			cursor: 'pointer'
		}
	},
	openedDrawer: {
		left: '220px'
	},
	closedDrawer: {
		left: '73px'
	},
	nameRole: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		margin: '0 20px 0 15px',
		maxWidth: '118px'
	},
	sepVertContainer: {
		display: 'flex',
		justifyContent: 'space-around',
		marginRight: '20px'
	},
	sepVert: {
		background: 'linear-gradient(180deg, rgba(94, 11, 128, 0) 0%, #475768 100%)',
		height: '59px',
		marginTop: '16px',
		width: '1px'
	},
	profileContainer: {
		width: '100%',
		position: 'absolute',
		zIndex: '999'
	},
	openedProfile: {
		transform: 'scaleY(-1)',
		'-webkit-transform': 'scaleY(-1)'
	},
	closedProfile: {
		transform: 'scaleY(1)',
		'-webkit-transform': 'scaleY(1)'
	}
});

const profileStyle = theme =>
	createStyles({
		profile: {
			minWidth: '201px',
			maxWidth: '201px',
			float: 'right',
			padding: '20px 20px 8px 20px',
			borderRadius: '4px',
			backgroundColor: '#1E262E',
			border: 'solid 1px #303c49'
		},
		profileFooter: {
			bottom: '7px',
			marginTop: '10px'
		},
		horizontalDivider: {
			height: '1px',
			backgroundColor: '#303c49'
		},
		profilePersonal: {
			padding: '20px 0px 4px 6px',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center'
		},
		profileCorporate: {
			padding: '20px 0px 14px 6px',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center'
		},
		profileDetail: {
			paddingBottom: '20px'
		},
		profileName: {
			paddingLeft: '28px'
		},
		button: {
			width: '189px'
		}
	});

const Profile = withStyles(profileStyle)(
	({ classes, profiles, isOpen, onClickPersonal, onClickCorporate }) => {
		return (
			isOpen && (
				<div className={classes.profile}>
					{profiles &&
						profiles.map((el, index) => (
							<Grid container key={index} className={classes.profileDetail}>
								<Grid item sm={2}>
									{el.profileType === 'company' ? (
										<RoundCompany />
									) : (
										<RoundPerson />
									)}
								</Grid>
								<Grid item sm={8} className={classes.profileName}>
									<Typography variant="h6">{`${el.firstName} ${
										el.lastName
									}`}</Typography>
									<Typography variant="subtitle1" color="secondary">
										{`${el.profileType.charAt(0).toUpperCase() +
											el.profileType.slice(1)} Profile`}
									</Typography>
								</Grid>
							</Grid>
						))}
					<Grid className={classes.profileFooter}>
						<div className={classes.horizontalDivider} />
					</Grid>
					<Grid container className={classes.profilePersonal}>
						<Grid item xs={12}>
							<Button
								variant="outlined"
								size="small"
								className={classes.button}
								onClick={onClickPersonal}
							>
								NEW PERSONAL PROFILE
							</Button>
						</Grid>
					</Grid>
					<Grid container className={classes.profileCorporate}>
						<Grid item xs={12}>
							<Button variant="outlined" size="small" onClick={onClickCorporate}>
								NEW CORPORATE PROFILE
							</Button>
						</Grid>
					</Grid>
				</div>
			)
		);
	}
);

const dummyProfiles = [
	{
		id: '1',
		firstName: 'Acme',
		lastName: 'Corp',
		profileType: 'company'
	},
	{
		id: '2',
		firstName: 'Standard United',
		lastName: 'Bank',
		profileType: 'company'
	}
];

class Toolbar extends Component {
	state = {
		isSidebarOpen: true,
		isProfileOpen: false
	};

	toggleDrawer = isSidebarOpen => {
		this.setState({
			isSidebarOpen
		});
	};

	toggleProfile = isProfileOpen => {
		this.setState({
			isProfileOpen
		});
	};

	createPersonalProfile = evt => {
		this.toggleProfile(!this.state.isProfileOpen);
		return this.props.createPersonalProfile(evt);
	};

	createCorporateProfile = evt => {
		this.toggleProfile(!this.state.isProfileOpen);
		return this.props.createCorporateProfile(evt);
	};

	render() {
		const { classes } = this.props;
		return (
			<div>
				<Sidebar isOpen={this.state.isSidebarOpen} onClose={this.toggleDrawer} />
				<Grid
					container
					direction="row"
					justify="flex-end"
					alignItems="center"
					className={classes.wrapper}
				>
					<MenuNewIcon
						style={{ position: 'absolute' }}
						className={`${classes.menuIcon} ${
							this.state.isSidebarOpen ? classes.openedDrawer : classes.closedDrawer
						}`}
						onClick={() => this.toggleDrawer(!this.state.isSidebarOpen)}
					/>
					<Grid item xs={9} style={{ paddingRight: '10px' }}>
						<Grid container direction="row" justify="flex-end" alignItems="center">
							<Grid item>
								<PriceBox cryptoCurrency={config.constants.primaryToken} />
							</Grid>
							<Grid item>
								<PriceBox cryptoCurrency="ETH" />
							</Grid>
						</Grid>
						<Grid item xs={2} style={{ minWidth: '240px' }}>
							<Grid container wrap="nowrap">
								<Grid item className={classes.sepVertContainer}>
									<div className={classes.sepVert} />
								</Grid>
								<Grid
									container
									direction="row"
									justify="flex-start"
									alignItems="center"
									spacing={0}
								>
									<Grid item style={{ width: '222px' }}>
										<Grid container wrap="nowrap">
											<Grid item>
												<RoundPerson />
											</Grid>
											<Grid item className={classes.nameRole}>
												<Typography variant="h6">Name Surname</Typography>
												<Typography variant="subtitle1" color="secondary">
													Personal Profile
												</Typography>
											</Grid>
											<Grid
												item
												style={{ marginTop: '18px', paddingRight: '15px' }}
											>
												<DropdownIcon
													className={`${classes.menuIcon} ${
														this.state.isProfileOpen
															? classes.openedProfile
															: classes.closedProfile
													}`}
													onClick={() =>
														this.toggleProfile(
															!this.state.isProfileOpen
														)
													}
												/>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
				<div id="profile" className={classes.profileContainer}>
					<Profile
						profiles={dummyProfiles}
						isOpen={this.state.isProfileOpen}
						onClickPersonal={this.createPersonalProfile}
						onClickCorporate={this.createCorporateProfile}
					/>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(Toolbar);
