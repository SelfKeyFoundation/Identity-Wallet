import React, { PureComponent } from 'react';
import {
	withStyles,
	List,
	ListItem,
	Drawer,
	ListItemIcon,
	Grid,
	Typography,
	// Input,
	// MenuItem,
	// Select,
	// IconButton
	Divider
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
	DashboardMenuIcon,
	MarketplaceMenuIcon,
	SelfkeyIDMenuIcon,
	AddressBookMenuIcon,
	SelfkeyLogo,
	MenuHelpIcon,
	SwitchAccountsIcon,
	PowerIcon,
	// KeyTooltip,
	// TooltipArrow,
	// MenuAffiliateIcon,
	MenuExportIcon,
	// InfoTooltip,
	primary
} from 'selfkey-ui';
// import { KeyboardArrowDown } from '@material-ui/icons';

const styles = theme => ({
	list: {
		justifyContent: 'space-between',
		margin: 0,
		minHeight: '100%',
		overflow: 'auto',
		width: '100%'
	},
	logoSection: {
		marginBottom: '30px',
		marginTop: '-30px'
	},
	logo: {
		width: '30px',
		height: '34px'
	},
	logoText: {
		fontFamily: 'Orbitron, arial, sans-serif',
		fontSize: '16px',
		letterSpacing: '2.77px',
		lineHeight: '22px',
		marginLeft: '13px',
		marginTop: '3px'
	},
	closeSection: {
		width: '100%'
	},
	pointer: {
		cursor: 'pointer'
	},
	link: {
		alignItems: 'center',
		display: 'flex',
		outline: 'none',
		textDecoration: 'none',
		'&:focus': {
			outline: 'none'
		}
	},
	listItem: {
		cursor: 'pointer',
		display: 'flex',
		marginBottom: '30px',
		paddingLeft: '10px',
		'& p': {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap'
		},
		'&:hover': {
			color: '#ffffff',
			'& p': {
				color: '#ffffff'
			},
			'& svg': {
				color: '#ffffff',
				fill: '#ffffff',
				stroke: '#ffffff'
			}
		},
		'&:focus': {
			outline: 0
		}
	},
	secondaryButtons: {
		alignItems: 'flex-end',
		display: 'flex',
		flexGrow: 2,
		width: 'inherit'
	},
	inheritWidth: {
		width: 'inherit'
	},
	inheritHeight: {
		height: 'inherit'
	},
	version: {
		color: '#fff',
		fontSize: '10px',
		opacity: 0.6,
		position: 'absolute',
		width: 'auto'
	},
	versionWrap: {
		paddingLeft: '50px'
	},
	drawer: {
		transition: 'all 3s',
		'& > div:first-of-type': {
			borderBottom: 'none',
			left: 0,
			opacity: '1 !important',
			right: 'auto'
		}
	},
	openedDrawer: {
		'& > div:first-of-type': {
			minWidth: 200,
			transition: 'all 0.2s ease-out'
		},
		'& .sidebarContainer': {
			overflow: 'auto',
			transition: 'all 0.2s ease-out',
			width: 200
		},
		'& .divider': {
			marginBottom: '30px',
			marginLeft: 9,
			paddingLeft: 0,
			transition: 'all 0.2s ease-out',
			width: 160
		}
	},
	closedDrawer: {
		'& > div:first-of-type': {
			minWidth: 56,
			transition: 'all 0.2s ease-out'
		},
		'& .sidebarContainer': {
			overflow: 'hidden',
			transition: 'all 0.2s ease-out',
			width: 56
		},
		'& .divider': {
			marginBottom: '30px',
			marginLeft: 9,
			paddingLeft: 0,
			transition: 'all 0.2s ease-out',
			width: 16
		}
	},
	listItemIcon: {
		marginRight: '22px'
	},
	select: {
		width: '160px'
	},
	network: {
		marginBottom: '30px',
		paddingLeft: '20px'
	},
	tooltip: {
		marginTop: '-2px',
		padding: '0 0 0 10px'
	},
	customWidth: {
		maxWidth: '168px'
	},
	tooltipLink: {
		color: primary,
		textDecoration: 'none'
	}
});

const dashboard = props => <Link to="/main/dashboard" {...props} />;
const marketplace = props => <Link to="/main/marketplace" {...props} />;
const addressBook = props => <Link to="/main/addressBook" {...props} />;
const switchAccount = props => <Link to="/home" {...props} />;
const exportAccount = props => <Link to="/main/export-wallet/warning" {...props} />;

class Sidebar extends PureComponent {
	state = {
		open: false
	};

	componentDidMount() {
		this.toggleDrawer(this.props.isOpen);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen !== this.props.isOpen) {
			this.toggleDrawer(this.props.isOpen);
		}
	}

	toggleDrawer = open => {
		this.props.onClose(open);
		this.setState({
			open
		});
	};

	render() {
		const { classes, onProfileNavigate, isExportableAccount } = this.props;

		const sideList = (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="flex-start"
				className={`${classes.list} sidebarContainer`}
				spacing={5}
			>
				<Grid item style={{ padding: '21px 0', flexGrow: 0 }}>
					<Grid
						container
						direction="row"
						alignItems="center"
						wrap="nowrap"
						style={{ paddingLeft: '13px' }}
					>
						<Link to="/main/dashboard" className={classes.link}>
							<SelfkeyLogo className={classes.logo} />
							<Typography variant="h1" className={classes.logoText}>
								SELFKEY
							</Typography>
						</Link>
					</Grid>
				</Grid>
				<Divider style={{ width: '100%', backgroundColor: '#475768', flexGrow: 0 }} />
				<Grid item style={{ padding: '50px 0 20px', flexGrow: 1 }}>
					<List style={{ paddingLeft: '10px' }}>
						<ListItem
							className={classes.listItem}
							component={dashboard}
							key="dashboard"
							title="Dashboard"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<DashboardMenuIcon width="16px" height="16px" viewBox="0 0 16 16" />
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								Dashboard
							</Typography>
						</ListItem>
						<ListItem
							id="marketplaceButton"
							className={classes.listItem}
							component={marketplace}
							key="marketplace"
							title="Marketplace"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<MarketplaceMenuIcon
									width="15px"
									height="16px"
									viewBox="0 0 15 16"
								/>
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								Marketplace
							</Typography>
						</ListItem>
						<ListItem
							id="addressBookButton"
							className={classes.listItem}
							component={addressBook}
							key="addressBook"
							title="Address Book"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<AddressBookMenuIcon
									width="15px"
									height="16px"
									viewBox="0 0 15 16"
								/>
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								Address Book
							</Typography>
						</ListItem>
						<Divider className={`divider`} />
						<ListItem
							id="selfkeyIdButton"
							className={classes.listItem}
							key="selfkeyId"
							onClick={onProfileNavigate}
							title="My Profile"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<SelfkeyIDMenuIcon width="14px" height="20px" viewBox="0 0 14 20" />
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								My Profile
							</Typography>
						</ListItem>
						{/* <ListItem
							id="affiliate"
							className={classes.listItem}
							component={affiliate}
							key="affiliate"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<MenuAffiliateIcon />
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								Affiliate Program
							</Typography>
						</ListItem> */}
						<Divider className={`divider`} />
					</List>
				</Grid>
				<Divider />
				<Grid item style={{ padding: '50px 0 20px' }}>
					{/* <Grid item className={classes.network}>
						<Typography variant="overline" gutterBottom>
							Network
							<KeyTooltip
								interactive
								placement="top-start"
								className={classes.tooltip}
								classes={{ tooltip: classes.customWidth }}
								title={
									<React.Fragment>
										<span>
											Modify the network settings to go from Ethereum Mainnet
											to Ropsten testnet.{' '}
											<a
												className={classes.tooltipLink}
												href="link"
												target="_blank"
												rel="noopener noreferrer"
											>
												What is a testnet?
											</a>
										</span>
										<TooltipArrow />
									</React.Fragment>
								}
							>
								<IconButton aria-label="Info">
									<InfoTooltip />
								</IconButton>
							</KeyTooltip>
						</Typography>
						<Select
							displayEmpty
							name="country"
							disableUnderline
							className={classes.select}
							IconComponent={KeyboardArrowDown}
							input={<Input disableUnderline />}
						>
							<MenuItem value="">
								<em>Choose...</em>
							</MenuItem>
							{['Selfkey Mainnet', 'Testnet'].map(item => (
								<MenuItem key={item} value={item}>
									{item}
								</MenuItem>
							))}
						</Select>
					</Grid> */}
					<List style={{ paddingLeft: '10px' }}>
						<ListItem
							className={classes.listItem}
							onClick={e => {
								window.openExternal(e, 'https://help.selfkey.org/');
							}}
							key="helpAndSupport"
							title="Help & Support"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<MenuHelpIcon />
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								Help & Support
							</Typography>
						</ListItem>

						{isExportableAccount && (
							<ListItem
								className={classes.listItem}
								component={exportAccount}
								key="exportAccount"
								title="Export Wallet"
							>
								<ListItemIcon className={classes.listItemIcon}>
									<MenuExportIcon />
								</ListItemIcon>
								<Typography variant="body2" color="secondary">
									Export Wallet
								</Typography>
							</ListItem>
						)}

						<ListItem
							className={classes.listItem}
							component={switchAccount}
							key="switchAccount"
							title="Switch Wallet"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<SwitchAccountsIcon />
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								Switch Wallet
							</Typography>
						</ListItem>
						<ListItem
							className={classes.listItem}
							key="quit"
							onClick={window.quit}
							title="Quit"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<PowerIcon />
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								Quit
							</Typography>
						</ListItem>
						<ListItem key="version" className={classes.versionWrap}>
							<Typography variant="subtitle2" className={classes.version}>
								V {window.appVersion}
							</Typography>
						</ListItem>
					</List>
				</Grid>
			</Grid>
		);

		return (
			<Drawer
				anchor="right"
				open={this.state.open}
				onClose={() => this.toggleDrawer(false)}
				className={`${classes.drawer} ${
					this.state.open ? classes.openedDrawer : classes.closedDrawer
				}`}
				variant="permanent"
			>
				<div tabIndex={0} role="button" className={classes.inheritHeight}>
					{sideList}
				</div>
			</Drawer>
		);
	}
}

export default withStyles(styles)(Sidebar);
