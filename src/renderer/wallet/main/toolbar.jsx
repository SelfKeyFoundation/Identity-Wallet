import React, { Component } from 'react';
import {
	createStyles,
	withStyles,
	Button,
	Grid,
	Typography,
	ClickAwayListener
} from '@material-ui/core';
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
		width: '100%',
		position: 'fixed',
		right: '2%',
		top: '63px',
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
			minWidth: '198px',
			maxWidth: '198px',
			float: 'right',
			padding: '20px 15px 8px 15px',
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
			paddingBottom: '20px',
			cursor: 'pointer'
		},
		profileName: {
			paddingLeft: '15px'
		},
		button: {
			width: '189px'
		}
	});

const defaultIdentityName = ({ type }) =>
	type === 'individual' ? 'New individual' : 'New company';

const ProfileList = withStyles(profileStyle)(
	({ classes, profiles, isOpen, onProfileSelect, onClickCorporate, closeProfile }) => {
		return (
			isOpen && (
				<ClickAwayListener onClickAway={closeProfile}>
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
										<Typography variant="h6">
											{el.name || defaultIdentityName(el)}
										</Typography>
										<Typography variant="subtitle1" color="secondary">
											{`${el.type.charAt(0).toUpperCase() +
												el.type.slice(1)} Profile`}
										</Typography>
									</Grid>
								</Grid>
							))}
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
								NEW PERSONAL PROFILE
							</Button>
						</Grid>
					</Grid> */}
						<Grid container className={classes.profileCorporate}>
							<Grid item xs={12}>
								<Button variant="outlined" size="small" onClick={onClickCorporate}>
									NEW CORPORATE PROFILE
								</Button>
							</Grid>
						</Grid>
					</div>
				</ClickAwayListener>
			)
		);
	}
);

const Profile = withStyles(styles)(
	({ classes, profile, isOpen, onProfileClick, onProfileNavigate }) => (
		<Grid container wrap="nowrap" onClick={onProfileNavigate}>
			<Grid item>{profile.type === 'individual' ? <RoundPerson /> : <RoundCompany />}</Grid>
			<Grid item className={classes.nameRole}>
				<Typography variant="h6">{profile.name || defaultIdentityName(profile)}</Typography>
				<Typography variant="subtitle1" color="secondary">
					{profile.type === 'individual' ? 'Personal Profile' : 'Corporate Profile'}
				</Typography>
			</Grid>
			<Grid item style={{ marginTop: '13px', paddingRight: '15px' }}>
				<DropdownIcon
					className={`${classes.menuIcon} ${
						isOpen ? classes.openedProfile : classes.closedProfile
					}`}
					onClick={onProfileClick}
				/>
			</Grid>
		</Grid>
	)
);

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
			onProfileNavigate,
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
						style={{ position: 'absolute' }}
						className={`${classes.menuIcon} ${
							isSidebarOpen ? classes.openedDrawer : classes.closedDrawer
						}`}
						onClick={() => onToggleMenu(!isSidebarOpen)}
					/>
					<Grid item xs={9} style={{ paddingRight: '10px' }}>
						<Grid container direction="row" justify="flex-end" alignItems="center">
							<Grid item>
								<PriceBox cryptoCurrency={primaryToken} />
							</Grid>
							<Grid item>
								<PriceBox cryptoCurrency="ETH" />
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={2} style={{ maxWidth: '240px' }}>
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
								<Grid item style={{ cursor: 'pointer', width: '222px' }}>
									<Profile
										profile={selectedProfile}
										isOpen={isProfileOpen}
										onProfileClick={onProfileClick}
										onProfileNavigate={onProfileNavigate}
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
						closeProfile={closeProfile}
					/>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(Toolbar);
