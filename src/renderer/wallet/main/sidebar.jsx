import React, { Component } from 'react';
import {
	withStyles,
	List,
	ListItem,
	Drawer,
	ListItemIcon,
	Grid,
	Typography,
	Divider
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Close from '@material-ui/icons/Close';
import {
	DashboardMenuIcon,
	MarketplaceMenuIcon,
	SelfkeyIDMenuIcon,
	AddressBookMenuIcon,
	SelfkeyLogo,
	MenuHelpIcon,
	SwitchAccountsIcon,
	PowerIcon
} from 'selfkey-ui';

const styles = theme => ({
	list: {
		justifyContent: 'space-between',
		margin: 0,
		minHeight: '100%',
		overflow: 'auto',
		width: 300
	},
	logoSection: {
		marginBottom: '30px',
		marginTop: '-30px',
		paddingLeft: '16px'
	},
	logo: {
		width: '38px',
		height: '44px'
	},
	logoText: {
		fontFamily: 'Orbitron, arial, sans-serif',
		fontSize: '18px',
		letterSpacing: '2.77px',
		lineHeight: '22px',
		paddingTop: '3px'
	},
	closeSection: {
		width: '100%'
	},
	pointer: {
		cursor: 'pointer'
	},
	listItem: {
		alignItems: 'end',
		cursor: 'pointer',
		display: 'flex',
		marginBottom: '30px',
		paddingLeft: '10px',
		'&:hover': {
			color: '#ffffff',
			'& p': {
				color: '#ffffff'
			},
			'& svg': {
				color: '#ffffff',
				stroke: '#ffffff'
			}
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
	textColor: {
		color: '#fff',
		opacity: 0.8,
		'&:hover': {
			opacity: 1
		}
	},
	version: {
		color: '#fff',
		fontSize: '10px',
		opacity: 0.6,
		position: 'absolute',
		right: 0,
		width: 'auto'
	},
	drawer: {
		transition: 'all 3s',
		'& > div:first-of-type': {
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
			transition: 'all 0.2s ease-out',
			width: 200
		}
	},
	closedDrawer: {
		'& > div:first-of-type': {
			minWidth: 56,
			transition: 'all 0.2s ease-out'
		},
		'& .sidebarContainer': {
			transition: 'all 0.2s ease-out',
			width: 56
		}
	},
	listItemIcon: {
		marginRight: '22px'
	}
});

const dashboard = props => <Link to="/main/dashboard" {...props} />;
const marketplace = props => <Link to="/main/marketplace-categories" {...props} />;
const selfkeyId = props => <Link to="/main/selfkeyId" {...props} />;
const addressBook = props => <Link to="/main/addressBook" {...props} />;
const switchAccount = props => <Link to="/home" {...props} />;

class Sidebar extends Component {
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
		const { classes } = this.props;

		const sideList = (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="flex-start"
				className={classes.list}
				spacing={40}
			>
				<Grid item className={classes.closeSection}>
					<Grid container direction="row" justify="flex-end" alignItems="flex-start">
						<Grid item>
							<Close color="secondary" className={classes.pointer} />
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="center"
						spacing={16}
						className={classes.logoSection}
					>
						<Link to="/main/dashboard" className={classes.link}>
							<SelfkeyLogo className={classes.logo} />
						</Link>
						<Typography variant="h1" className={classes.logoText}>
							SELFKEY
						</Typography>
					</Grid>
				</Grid>
				</Grid>
				<Grid item>
					<List>
						<ListItem
							className={classes.listItem}
							component={dashboard}
							key="dashboard"
						>
							<ListItemIcon>
								<DashboardMenuIcon />
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
						>
							<ListItemIcon>
								<MarketplaceMenuIcon />
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								Marketplace
							</Typography>
						</ListItem>
						<ListItem
							id="selfkeyIdButton"
							className={classes.listItem}
							component={selfkeyId}
							key="selfkeyId"
						>
							<ListItemIcon>
								<SelfkeyIDMenuIcon />
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								SelfKey ID
							</Typography>
						</ListItem>
						<ListItem
							id="addressBookButton"
							className={classes.listItem}
							component={addressBook}
							key="addressBook"
						>
							<ListItemIcon>
								<AddressBookMenuIcon />
							</ListItemIcon>
							<Typography variant="body2" color="secondary">
								Address Book
							</Typography>
						</ListItem>
					</List>
				</Grid>
				<Divider />
				<Grid item className={classes.secondaryButtons}>
					<List className={classes.inheritWidth}>
						<ListItem
							className={classes.listItem}
							onClick={e => {
								window.openExternal(e, 'https://help.selfkey.org/');
							}}
							key="helpAndSupport"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<MenuHelpIcon />
							</ListItemIcon>
							<Typography variant="body2" className={classes.textColor}>
								Help & Support
							</Typography>
						</ListItem>
						<ListItem
							className={classes.listItem}
							component={switchAccount}
							key="switchAccount"
						>
							<ListItemIcon className={classes.listItemIcon}>
								<SwitchAccountsIcon />
							</ListItemIcon>
							<Typography variant="body2" className={classes.textColor}>
								Switch Accounts
							</Typography>
						</ListItem>
						<ListItem className={classes.listItem} key="quit" onClick={window.quit}>
							<ListItemIcon className={classes.listItemIcon}>
								<PowerIcon />
							</ListItemIcon>
							<Typography variant="body2" className={classes.textColor}>
								Quit
							</Typography>
						</ListItem>
						<ListItem key="version">
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
				<div
					tabIndex={0}
					role="button"
					onClick={() => this.toggleDrawer(false)}
					onKeyDown={() => this.toggleDrawer(false)}
					className={classes.inheritHeight}
				>
					{sideList}
				</div>
			</Drawer>
		);
	}
}

export default withStyles(styles)(Sidebar);
