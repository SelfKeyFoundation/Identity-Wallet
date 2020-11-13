import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { MarketplaceIcon, WarningShieldIcon } from 'selfkey-ui';
import { connect } from 'react-redux';
import { vendorOperations } from '../../common/marketplace/vendors';

const styles = theme => ({
	header: {
		'& h1': {
			marginLeft: theme.spacing(2)
		},
		'& svg': {
			marginLeft: theme.spacing(0)
		},
		width: '100%',
		height: '40px',
		marginBottom: theme.spacing(2)
	},
	headerIcon: {
		marginLeft: theme.spacing(4)
	},
	hr: {
		backgroundColor: '#475768',
		border: 0,
		height: '1px',
		margin: theme.spacing(0),
		width: '100%'
	},
	content: {
		margin: '120px auto',
		maxWidth: '500px',
		textAlign: 'center',
		'& svg': {
			marginBottom: theme.spacing(2)
		},
		'& h1': {
			marginBottom: theme.spacing(2)
		}
	},
	bottomSpace: {
		marginBottom: theme.spacing(2)
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
					<Typography variant="body1" color="secondary" className={classes.bottomSpace}>
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
