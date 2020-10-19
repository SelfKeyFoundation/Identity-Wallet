import React, { PureComponent } from 'react';
import { Button, Grid, Typography, ClickAwayListener } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/styles';
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
import { HexagonAvatar } from '../../selfkey-id/main/components/hexagon-avatar';
import { featureIsEnabled } from 'common/feature-flags';

const styles = theme => ({
	wrapper: {
		backgroundColor: '#27333D',
		boxShadow:
			'inset 0 -1px 0 0 #475768, 1px 0 0 0 rgba(118,128,147,0.2), 2px 0 2px 0 rgba(0,0,0,0.2)',
		height: '78px',
		padding: '0 2%',
		position: 'fixed',
		zIndex: 2
	},
	logo: {
		cursor: 'pointer',
		height: '44px',
		marginLeft: theme.spacing(3),
		transition: '1.0s',
		width: '38px',
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
		margin: theme.spacing(0, 2),
		maxWidth: '118px',
		'& .toolbarProfileName': {
			maxWidth: '110px',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap'
		}
	},
	sepVertContainer: {
		display: 'flex',
		justifyContent: 'space-around',
		marginRight: theme.spacing(3)
	},
	sepVert: {
		background: 'linear-gradient(180deg, rgba(94, 11, 128, 0) 0%, #475768 100%)',
		height: '59px',
		marginTop: theme.spacing(2),
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
		cursor: 'pointer',
		marginTop: theme.spacing(2),
		paddingRight: theme.spacing(2)
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
		paddingRight: theme.spacing(2)
	},
	profileAvatar: {
		height: '40px',
		margin: theme.spacing(0),
		width: '40px'
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
			marginTop: theme.spacing(2),
			padding: theme.spacing(0, 2)
		},
		horizontalDivider: {
			height: '1px',
			backgroundColor: '#303c49'
		},
		profilePersonal: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			padding: theme.spacing(3, 0, 0.5, 1)
		},
		profileCorporate: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			padding: theme.spacing(3, 2, 2)
		},
		profileDetail: {
			cursor: 'pointer',
			padding: theme.spacing(1, 2),
			width: '208px',
			'&:hover': {
				backgroundColor: '#313D49'
			},
			'&:first-child': {
				marginTop: theme.spacing(1)
			}
		},
		profileName: {
			paddingLeft: theme.spacing(1),
			'& h6:first-child': {
				marginBottom: theme.spacing(0.5)
			}
		},
		button: {
			width: '189px'
		},
		smallButton: {
			fontSize: '10px',
			letterSpacing: '0.4px',
			width: '100%'
		},
		profileListAvatar: {
			height: '28px',
			margin: theme.spacing(0),
			width: '28px'
		}
	});

const ProfileList = withStyles(profileStyle)(
	({
		classes,
		profiles,
		profileNames,
		wallet,
		isOpen,
		onProfileSelect,
		onClickCorporate,
		closeProfile,
		selectedProfile,
		showCorporate
	}) => {
		return (
			isOpen && (
				<ClickAwayListener onClickAway={closeProfile}>
					<div className={classes.profile}>
						{profiles &&
							profiles
								.filter(el => el.id !== selectedProfile.id)
								.map((el, index) => (
									<Grid
										container
										key={index}
										className={classes.profileDetail}
										onClick={onProfileSelect(el)}
									>
										<Grid item sm={2}>
											{el.type === 'corporate' ? (
												<SmallRoundCompany />
											) : el.profilePicture ? (
												<HexagonAvatar
													src={el.profilePicture}
													className={classes.profileListAvatar}
													smallAvatar={true}
												/>
											) : (
												<SmallRoundPerson />
											)}
										</Grid>
										<Grid item sm={8} className={classes.profileName}>
											<Typography variant="subtitle1">
												{profileNames[el.id]}
											</Typography>
											<Typography variant="subtitle2" color="secondary">
												{`${el.type.charAt(0).toUpperCase() +
													el.type.slice(1)} Profile`}
											</Typography>
										</Grid>
									</Grid>
								))}
						{showCorporate && (
							<React.Fragment>
								{profiles && profiles.length ? (
									<Grid className={classes.profileFooter}>
										<div className={classes.horizontalDivider} />
									</Grid>
								) : null}
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
				</ClickAwayListener>
			)
		);
	}
);

const Profile = withStyles(styles)(
	({
		classes,
		profile,
		profileName,
		wallet,
		isOpen,
		onProfileClick,
		onProfileNavigate,
		showCorporate
	}) => (
		<Grid container wrap="nowrap" justify="space-between">
			<Grid item>
				<Grid container onClick={onProfileNavigate}>
					<Grid item>
						{profile.type === 'corporate' ? (
							<RoundCompany />
						) : profile.profilePicture ? (
							<HexagonAvatar
								src={profile.profilePicture}
								className={classes.profileAvatar}
								smallAvatar={true}
							/>
						) : (
							<RoundPerson />
						)}
					</Grid>
					<Grid item className={classes.nameRole}>
						<Typography variant="h6" className="toolbarProfileName" title={profileName}>
							{profileName}
						</Typography>
						<Typography variant="subtitle1" color="secondary">
							{profile.type === 'individual'
								? 'Personal Profile'
								: 'Corporate Profile'}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			{showCorporate && (
				<Grid item className={classes.profileIcon} onClick={onProfileClick}>
					<DropdownIcon
						className={`${classes.menuIcon} ${
							isOpen ? classes.openedProfile : classes.closedProfile
						}`}
					/>
				</Grid>
			)}
		</Grid>
	)
);

class Toolbar extends PureComponent {
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
			profileNames,
			wallet,
			onCreateCorporateProfileClick,
			primaryToken,
			rewardToken,
			showCorporate,
			isExportableAccount,
			showStaking
		} = this.props;
		return (
			<div>
				<Sidebar
					isOpen={isSidebarOpen}
					showStaking={showStaking}
					onClose={onToggleMenu}
					onProfileNavigate={onProfileNavigate}
					isExportableAccount={isExportableAccount}
				/>
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
							<div>
								<PriceBox cryptoCurrency={primaryToken} />
							</div>
							{featureIsEnabled('rewardToken') && (
								<div>
									<PriceBox cryptoCurrency={rewardToken} />
								</div>
							)}
							<div>
								<PriceBox cryptoCurrency="ETH" />
							</div>
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
										wallet={wallet}
										profile={selectedProfile}
										profileName={profileNames[selectedProfile.id]}
										isOpen={isProfileOpen}
										onProfileClick={onProfileClick}
										onProfileNavigate={onProfileNavigate}
										showCorporate={showCorporate}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid id="profile" className={classes.profileContainer}>
					<ProfileList
						wallet={wallet}
						profiles={profiles}
						profileNames={profileNames}
						isOpen={isProfileOpen}
						onClickCorporate={onCreateCorporateProfileClick}
						onProfileSelect={onProfileSelect}
						closeProfile={closeProfile}
						showCorporate={showCorporate}
						selectedProfile={selectedProfile}
					/>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(Toolbar);
