import React from 'react';
import { Grid, withStyles, Typography, Button } from '@material-ui/core';
import { MarketplaceIcon, WarningShieldIcon } from 'selfkey-ui';
import { connect } from 'react-redux';
import { vendorOperations } from '../../common/marketplace/vendors';

const styles = theme => ({
	header: {
		'& h1': {
			marginLeft: '20px'
		},
		'& svg': {
			marginLeft: 0
		},
		width: '100%',
		height: '40px',
		marginBottom: '20px'
	},
	headerIcon: {
		marginLeft: '30px'
	},
	headerTitle: {
		paddingLeft: '21px'
	},
	hr: {
		backgroundColor: '#475768',
		border: 0,
		height: '1px',
		margin: 0,
		width: '100%'
	},
	content: {
		maxWidth: '500px',
		margin: '120px auto',
		textAlign: 'center',
		'& svg': {
			marginBottom: '20px'
		},
		'& h1': {
			marginBottom: '20px'
		}
	}
});

const mapStateToProps = state => ({});

export const MarketplaceLoadingErrorContainer = connect(mapStateToProps)(
	withStyles(styles)(({ classes, dispatch }) => {
		const tryAgainClick = () => {
			dispatch(vendorOperations.refreshVendorsOperation());
		};
		return (
			<Grid
				id="viewMarketplace"
				container
				direction="column"
				justify="space-between"
				alignItems="stretch"
			>
				<Grid
					container
					item
					className={classes.header}
					xs={12}
					direction="row"
					alignItems="center"
				>
					<Grid item>
						<MarketplaceIcon className={classes.headerIcon} />
					</Grid>
					<Grid item>
						<Typography variant="h1">SelfKey Marketplace</Typography>
					</Grid>
				</Grid>
				<Grid container xs={12}>
					<hr className={classes.hr} />
				</Grid>
				<Grid item id="body" xs={12} alignItems="center" className={classes.content}>
					<WarningShieldIcon />
					<Typography variant="h1">Loading Error</Typography>
					<Typography variant="body1" color="secondary" gutterBottom>
						It appears that the selfkey marketplace has failed to load
					</Typography>
					<Button variant="contained" size="large" onClick={tryAgainClick}>
						Try Again
					</Button>
				</Grid>
			</Grid>
		);
	})
);

export default MarketplaceLoadingErrorContainer;
