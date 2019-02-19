import React, { Component } from 'react';
import { withStyles, Grid, IconButton } from '@material-ui/core';
import { SelfkeyLogo, MenuButtonIcon } from 'selfkey-ui';
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
		marginLeft: '20px'
	},

	sepVert: {
		height: '59px',
		width: '3px',
		boxShadow: '1px 0 0 0 rgba(118,128,147,0.2), 2px 0 2px 0 rgba(0,0,0,0.2)'
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
						<SelfkeyLogo className={classes.logo} />
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
							<Grid item xs={5}>
								<div className={classes.sepVert} />
							</Grid>
							<Grid item xs={7}>
								<IconButton disableRipple>
									<MenuButtonIcon
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
