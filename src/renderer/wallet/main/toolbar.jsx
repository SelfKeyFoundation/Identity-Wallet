import React, { Component } from 'react';
import {
	createStyles,
	withStyles,
	Button,
	Grid,
	Typography,
	ClickAwayListener
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
	MenuNewIcon,
	DropdownIcon,
	SmallRoundCompany,
	SmallRoundPerson,
	RoundCompany,
	RoundPerson
} from 'selfkey-ui';
import PriceBox from '../../price-box';
import Sidebar from './sidebar';
import { featureIsEnabled } from 'common/feature-flags';

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
	flexLink: {
		display: 'flex',
		textDecoration: 'none'
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
		left: '-33px',
		position: 'fixed',
		right: '2%',
		top: '63px',
		width: '100%',
		zIndex: '999',
		'@media screen and (min-width: 1480px)': {
			left: '-43px'
		}
	},
	openedProfile: {
		transform: 'scaleY(-1)',
		'-webkit-transform': 'scaleY(-1)'
	},
	closedProfile: {
		transform: 'scaleY(1)',
		'-webkit-transform': 'scaleY(1)'
	},
	profileIcon: {
		marginTop: '13px',
		paddingRight: '15px'
	},
	absolute: {
		position: 'absolute'
	},
	maxWidth: {
		maxWidth: '240px'
	},
	toolbarProfile: {
		cursor: 'pointer',
		width: '222px'
	},
	priceBox: {
		paddingRight: '10px'
	}
});

const profileStyle = theme =>
	createStyles({
		profile: {
			minWidth: '208px',
			maxWidth: '208px',
			float: 'right',
			borderRadius: '4px',
			backgroundColor: '#1E262E',
			border: 'solid 1px #303c49'
		},
		profileFooter: {
			bottom: '7px',
			marginTop: '10px',
			padding: '0 15px'
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
			padding: '20px 15px 14px',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center'
		},
		profileDetail: {
			cursor: 'pointer',
			padding: '10px 15px 10px 15px',
			width: '208px',
			'&:hover': {
				backgroundColor: '#313D49'
			},
			'&:first-child': {
				marginTop: '5px'
			}
		},
		profileName: {
			paddingLeft: '15px',
			'& h6:first-child': {
				marginBottom: '5px'
			}
		},
		button: {
			width: '189px'
		},
		smallButton: {
			fontSize: '10px',
			letterSpacing: '0.4px',
			width: '100%'
		}
	});

const defaultIdentityName = ({ type }) =>
	type === 'individual' ? 'New individual' : 'New company';

const ProfileList = withStyles(profileStyle)(
	({ classes, profiles, isOpen, onProfileSelect, onClickCorporate }) => {
		return (
			isOpen && (
				<div className={classes.profile}>
					{profiles &&
						profiles.map((el, index) => (
							<Grid
								container
								key={index}
								className={classes.profileDetail}
								onClick={onProfileSelect(el)}
							>
								<Grid item sm={2}>
									{el.type === 'corporate' ? (
										<SmallRoundCompany />
									) : (
										<SmallRoundPerson />
									)}
								</Grid>
								<Grid item sm={8} className={classes.profileName}>
									<Typography variant="subtitle1">
										{el.name || defaultIdentityName(el)}
									</Typography>
									<Typography variant="subtitle2" color="secondary">
										{`${el.type.charAt(0).toUpperCase() +
											el.type.slice(1)} Profile`}
									</Typography>
								</Grid>
							</Grid>
						))}
					{featureIsEnabled('corporate') && (
						<React.Fragment>
							<Grid className={classes.profileFooter}>
								<div className={classes.horizontalDivider} />
							</Grid>
							{/* <Grid container className={classes.profilePersonal}>
								<Grid item xs={12}>
									<Button
										variant="outlined"
										size="small"
										className={classes.button}
										onClick={onClickPersonal}
									>
										New Personal Profile
									</Button>
								</Grid>
							</Grid> */}
							<Grid container className={classes.profileCorporate}>
								<Grid item xs={12}>
									<Button
										variant="outlined"
										size="small"
										onClick={onClickCorporate}
										className={classes.smallButton}
									>
										New Corporate Profile
									</Button>
								</Grid>
							</Grid>
						</React.Fragment>
					)}
				</div>
			)
		);
	}
);

const Profile = withStyles(styles)(({ classes, profile, isOpen, onProfileClick, closeProfile }) => (
	<ClickAwayListener onClickAway={closeProfile}>
		<Grid container wrap="nowrap" justify="space-between">
			<Link to="/main/selfkeyId" className={classes.flexLink}>
				<Grid item>
					{profile.type === 'individual' ? <RoundPerson /> : <RoundCompany />}
				</Grid>
				<Grid item className={classes.nameRole}>
					<Typography variant="h6">
						{profile.name || defaultIdentityName(profile)}
					</Typography>
					<Typography variant="subtitle1" color="secondary">
						{profile.type === 'individual' ? 'Personal Profile' : 'Corporate Profile'}
					</Typography>
				</Grid>
			</Link>
			<Grid item className={classes.profileIcon}>
				<DropdownIcon
					className={`${classes.menuIcon} ${
						isOpen ? classes.openedProfile : classes.closedProfile
					}`}
					onClick={onProfileClick}
				/>
			</Grid>
		</Grid>
	</ClickAwayListener>
));

class Toolbar extends Component {
	render() {
		const {
			classes,
			onToggleMenu,
			isSidebarOpen,
			isProfileOpen,
			closeProfile,
			selectedProfile,
			onProfileClick,
			onProfileSelect,
			profiles,
			onCreateCorporateProfileClick,
			primaryToken
		} = this.props;
		return (
			<div>
				<Sidebar isOpen={isSidebarOpen} onClose={onToggleMenu} />
				<Grid
					container
					direction="row"
					justify="flex-end"
					alignItems="center"
					className={classes.wrapper}
				>
					<MenuNewIcon
						className={`${classes.menuIcon} ${classes.absolute} ${
							isSidebarOpen ? classes.openedDrawer : classes.closedDrawer
						}`}
						onClick={() => onToggleMenu(!isSidebarOpen)}
					/>
					<Grid item xs={9} className={classes.priceBox}>
						<Grid container direction="row" justify="flex-end" alignItems="center">
							<Grid item>
								<PriceBox cryptoCurrency={primaryToken} />
							</Grid>
							<Grid item>
								<PriceBox cryptoCurrency="ETH" />
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={2} className={classes.maxWidth}>
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
								<Grid item className={classes.toolbarProfile}>
									<Profile
										profile={selectedProfile}
										isOpen={isProfileOpen}
										onProfileClick={onProfileClick}
										closeProfile={closeProfile}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid id="profile" className={classes.profileContainer}>
					<ProfileList
						profiles={profiles}
						isOpen={isProfileOpen}
						onClickCorporate={onCreateCorporateProfileClick}
						onProfileSelect={onProfileSelect}
					/>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(Toolbar);
