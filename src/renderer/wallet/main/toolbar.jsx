import React, { Component } from 'react';
import { withStyles, Grid, IconButton } from '@material-ui/core';
import { SelfkeyLogo, MenuButtonIcon } from 'selfkey-ui';
import { Link } from 'react-router-dom';
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

	sepVertContainer: {
		display: 'flex',
		justifyContent: 'space-around'
	},

	sepVert: {
		background: 'linear-gradient(180deg, rgba(94, 11, 128, 0) 0%, #475768 100%)',
		height: '59px',
		marginTop: '16px',
		width: '1px'
	},

	menuButton: {
		width: '30px',
		height: '30px'
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
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="center"
					className={classes.wrapper}
				>
					<Grid item xs={5}>
						<Link to="/main/dashboard" className={classes.link}>
							<SelfkeyLogo className={classes.logo} />
						</Link>
					</Grid>
					<Grid item xs={6}>
						<Grid container direction="row" justify="flex-end" alignItems="center">
							<Grid item>
								<PriceBox cryptoCurrency={config.constants.primaryToken} />
							</Grid>
							<Grid item>
								<PriceBox cryptoCurrency="ETH" />
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={1}>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							spacing={0}
						>
							<Grid item xs={5} className={classes.sepVertContainer}>
								<div className={classes.sepVert} />
							</Grid>
							<Grid item xs={7}>
								<IconButton disableRipple>
									<MenuButtonIcon
										id="drawer"
										className={classes.menuButton}
										onClick={() => this.toggleDrawer(true)}
									/>
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(Toolbar);
