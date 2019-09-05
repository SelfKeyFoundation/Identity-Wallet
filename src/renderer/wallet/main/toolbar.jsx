import React, { Component } from 'react';
import {
	withStyles,
	Grid
	// Typography
} from '@material-ui/core';
import {
	MenuNewIcon
	// DropdownIcon,
	// PersonIcon
} from 'selfkey-ui';
import PriceBox from '../../price-box';
import Sidebar from './sidebar';
import config from 'common/config';

const styles = theme => ({
	wrapper: {
		backgroundColor: '#27333D',
		boxShadow:
			'inset 0 -1px 0 0 #475768, 1px 0 0 0 rgba(118,128,147,0.2), 2px 0 2px 0 rgba(0,0,0,0.2)'
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
	}
});

class Toolbar extends Component {
	state = {
		isSidebarOpen: false
	};

	toggleDrawer = isSidebarOpen => {
		this.setState({
			isSidebarOpen
		});
	};

	render() {
		const { classes } = this.props;
		return (
			<div>
				<Sidebar isOpen={this.state.isSidebarOpen} onClose={this.toggleDrawer} />
				<MenuNewIcon
					style={{ position: 'absolute', marginTop: '27px' }}
					className={`${classes.menuIcon} ${
						this.state.isSidebarOpen ? classes.openedDrawer : classes.closedDrawer
					}`}
					onClick={() => this.toggleDrawer(!this.state.isSidebarOpen)}
				/>
				<Grid
					container
					direction="row"
					justify="flex-end"
					alignItems="center"
					className={classes.wrapper}
				>
					<Grid item xs={9} style={{ paddingRight: '10px' }}>
						<Grid container direction="row" justify="flex-end" alignItems="center">
							<Grid item>
								<PriceBox cryptoCurrency={config.constants.primaryToken} />
							</Grid>
							<Grid item>
								<PriceBox cryptoCurrency="ETH" />
							</Grid>
						</Grid>
					</Grid>
					{/* PROFILE SWITCH - DROPDOWN
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
											<PersonIcon />
										</Grid>
										<Grid item className={classes.nameRole}>
											<Typography variant="h6">Name</Typography>
											<Typography variant="subtitle1" color="secondary">
												Personal Profile
											</Typography>
										</Grid>
										<Grid
											item
											style={{ marginTop: '18px', paddingRight: '15px' }}
										>
											<DropdownIcon />
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid> */}
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(Toolbar);
