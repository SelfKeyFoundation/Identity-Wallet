import React, { Component } from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { MenuNewIcon } from 'selfkey-ui';
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
		left: '77px'
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
					justify="space-between"
					alignItems="center"
					className={classes.wrapper}
				>
					<Grid item xs={12} style={{ paddingRight: '60px' }}>
						<Grid container direction="row" justify="flex-end" alignItems="center">
							<Grid item>
								<PriceBox cryptoCurrency={config.constants.primaryToken} />
							</Grid>
							<Grid item>
								<PriceBox cryptoCurrency="ETH" />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(Toolbar);
