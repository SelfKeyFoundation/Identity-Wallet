import React, { PureComponent } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CustomIcon, CoinsIcon } from 'selfkey-ui';
import BuyKeyPopup from './buy-key-popup-container';

const styles = theme => ({
	bgIcon: {
		top: '-60px',
		marginTop: '-112px',
		opacity: '0.5',
		position: 'relative',
		right: '-250px',
		zIndex: 0
	},
	buyKey: {
		backgroundColor: '#1E262E',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		flexGrow: 1,
		height: '236px',
		marginBottom: '15px',
		maxHeight: '236px',
		overflow: 'hidden',
		padding: '20px 30px 30px'
	},
	ctabutton: {
		display: 'flex',
		justifyContent: 'space-between',
		maxWidth: '100%',
		marginLeft: 'auto',
		marginRight: '0',
		width: '100%',
		'& span': {
			flexGrow: 1
		}
	},
	title: {
		fontSize: '20px',
		marginBottom: '30px'
	},
	'@media screen and (min-width: 1230px)': {
		bgIcon: {
			right: '-269px'
		}
	}
});

class BuyKeyWidget extends PureComponent {
	state = {
		popup: null
	};

	handlePopup = () => {
		this.setState({ popup: 'open' });
	};

	handlePopupClose = () => {
		this.setState({ popup: null });
	};

	handleExternalLink = e => {
		window.openExternal(e, 'https://help.selfkey.org/article/147-what-is-a-did');
	};

	render() {
		const { classes } = this.props;
		const { popup } = this.state;
		return (
			<React.Fragment>
				{popup !== null && (
					<BuyKeyPopup
						closeAction={this.handlePopupClose}
						externalLink={this.handleExternalLink}
					/>
				)}
				<Grid item className={classes.buyKey}>
					<Typography variant="h1" className={classes.title}>
						Buy KEY tokens, to use in the SelfKey Marketplace.
					</Typography>
					<Button
						variant="outlined"
						size="large"
						className={classes.ctabutton}
						onClick={this.handlePopup}
					>
						<CustomIcon width="24px" height="24px" />
						<span>Buy KEY</span>
					</Button>
					<div className={classes.bgIcon}>
						<CoinsIcon width="76px" height="79px" fill="#313B49" />
					</div>
				</Grid>
			</React.Fragment>
		);
	}
}

export default withStyles(styles)(BuyKeyWidget);
