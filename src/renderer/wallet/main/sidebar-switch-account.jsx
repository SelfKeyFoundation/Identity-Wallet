import React, { PureComponent } from 'react';
import { Button, Drawer, Grid, List, ListItem, Typography, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import { SelfkeyLogo } from 'selfkey-ui';
import PersonIcon from 'selfkey-ui/build/lib/icons/person';
import CorporateIcon from 'selfkey-ui/build/lib/icons/corporate';

const styles = theme => ({
	list: {
		justifyContent: 'space-between',
		margin: theme.spacing(0),
		minHeight: '100%',
		overflow: 'auto',
		width: 300
	},
	listItem: {
		alignItems: 'end',
		cursor: 'pointer',
		display: 'flex',
		paddingLeft: theme.spacing(0),
		'&:hover': {
			'& h6': {
				transition: 'all 0.3s'
			},
			'& p': {
				color: '#ffffff',
				transition: 'all 0.3s'
			},
			'& svg': {
				'& path': {
					fill: '#ffffff',
					transition: 'all 0.3s'
				}
			}
		}
	},
	logoSection: {
		marginBottom: theme.spacing(4),
		marginTop: theme.spacing(4),
		paddingLeft: theme.spacing(2)
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
		right: 0,
		width: 'auto'
	},
	drawer: {
		transition: 'all 3s',
		'& > div:first-of-type': {
			opacity: '1 !important'
		}
	},
	fullWidth: {
		width: '100%'
	},
	iconSpace: {
		marginRight: theme.spacing(2)
	},
	gridBottomSpace: {
		marginBottom: theme.spacing(2)
	},
	nameRole: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around'
	}
});

const dataIDType = [
	{
		name: 'Andrew Jones',
		type: 'Personal'
	},
	{
		name: 'Andrew Jones US',
		type: 'Personal'
	},
	{
		name: 'Google Inc',
		type: 'Corporate'
	}
];

const IDType = withStyles(styles)(({ dataIDType, classes }) => {
	return (
		<React.Fragment>
			{dataIDType.map((data, index) => {
				return (
					<div key={index}>
						<ListItem className={classes.listItem} key="dashboard">
							<Grid container>
								<Grid item className={classes.iconSpace}>
									{data.type === 'Personal' ? <PersonIcon /> : <CorporateIcon />}
								</Grid>
								<Grid item className={classes.nameRole}>
									<Typography variant="h6">{data.name}</Typography>
									<Typography variant="subtitle1" color="secondary">
										{data.type}
									</Typography>
								</Grid>
							</Grid>
						</ListItem>
						<Divider className={classes.gridBottomSpace} />
					</div>
				);
			})}
		</React.Fragment>
	);
});

class SidebarSwitchAccount extends PureComponent {
	state = {
		open: true
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
				spacing={5}
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
						spacing={2}
						className={classes.logoSection}
					>
						<Grid item>
							<SelfkeyLogo className={classes.logo} />
						</Grid>
						<Grid item>
							<Typography variant="h1" className={classes.logoText}>
								SELFKEY
							</Typography>
						</Grid>
					</Grid>
				</Grid>
				<Grid item className={classes.fullWidth}>
					<Grid container>
						<Typography variant="body1" style={{ marginBottom: '32px' }}>
							Choose a SelfKey ID
						</Typography>
					</Grid>

					<List>
						<IDType dataIDType={dataIDType} />
					</List>
				</Grid>
				<Divider />
				<Grid item className={classes.fullWidth}>
					<Grid
						item
						className={classes.secondaryButtons}
						style={{ marginBottom: '16px' }}
					>
						<Button variant="outlined" className={classes.fullWidth}>
							New Personal Account
						</Button>
					</Grid>
					<Grid
						item
						className={classes.secondaryButtons}
						style={{ marginBottom: '16px' }}
					>
						<Button variant="outlined" className={classes.fullWidth}>
							New Corporate Account
						</Button>
					</Grid>
					<Grid item className={classes.secondaryButtons}>
						<Button variant="outlined" color="secondary" className={classes.fullWidth}>
							Back to menu
						</Button>
					</Grid>
				</Grid>
				<Grid item className={classes.secondaryButtons}>
					<List className={classes.inheritWidth}>
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
			<Drawer anchor="right" open={this.state.open} className={classes.drawer}>
				<div tabIndex={0} role="button" className={classes.inheritHeight}>
					{sideList}
				</div>
			</Drawer>
		);
	}
}

export default withStyles(styles)(SidebarSwitchAccount);
