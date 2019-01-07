import React, { Component } from 'react';
import {
	withStyles,
	List,
	ListItem,
	ListItemText,
	Drawer,
	ListItemIcon,
	Grid,
	Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Close from '@material-ui/icons/Close';
import {
	DashboardMenuIcon,
	MarketplaceMenuIcon,
	SelfkeyIDMenuIcon,
	AddressBookMenuIcon,
	SelfkeyLogo
} from 'selfkey-ui';

const styles = theme => ({
	list: {
		width: 300
	},

	logoSection: {
		paddingLeft: '16px'
	},

	logo: {
		width: '38px',
		height: '44px'
	},

	closeSection: {
		width: '100%'
	}
});

const dashboard = props => <Link to="/main/dashboard" {...props} />;
const marketplace = props => <Link to="/main/marketplace" {...props} />;
const selfkeyID = props => <Link to="/main/selfkeyID" {...props} />;
const addressBook = props => <Link to="/main/addressBook" {...props} />;

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
				<Grid item xs={12} className={classes.closeSection}>
					<Grid container direction="row" justify="flex-end" alignItems="flex-start">
						<Grid item>
							<Close />
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="center"
						spacing={16}
						className={classes.logoSection}
					>
						<Grid item>
							<SelfkeyLogo className={classes.logo} />
						</Grid>
						<Grid item>
							<Typography variant="h1">SELFKEY</Typography>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<List>
						<ListItem component={dashboard} key="dashboard">
							<ListItemIcon>
								<DashboardMenuIcon />
							</ListItemIcon>
							<ListItemText primary="Dashboard" />
						</ListItem>
						<ListItem component={marketplace} key="marketplace">
							<ListItemIcon>
								<MarketplaceMenuIcon />
							</ListItemIcon>
							<ListItemText primary="Marketplace" />
						</ListItem>
						<ListItem component={selfkeyID} key="selfkeyID">
							<ListItemIcon>
								<SelfkeyIDMenuIcon />
							</ListItemIcon>
							<ListItemText primary="SelfKey ID" />
						</ListItem>
						<ListItem component={addressBook} key="addressBook">
							<ListItemIcon>
								<AddressBookMenuIcon />
							</ListItemIcon>
							<ListItemText primary="Address Book" />
						</ListItem>
					</List>
				</Grid>
			</Grid>
		);

		return (
			<Drawer anchor="right" open={this.state.open} onClose={() => this.toggleDrawer(false)}>
				<div
					tabIndex={0}
					role="button"
					onClick={() => this.toggleDrawer(false)}
					onKeyDown={() => this.toggleDrawer(false)}
				>
					{sideList}
				</div>
			</Drawer>
		);
	}
}

export default withStyles(styles)(Sidebar);
