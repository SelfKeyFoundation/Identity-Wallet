import React from 'react';
import { Grid, withStyles, Typography } from '@material-ui/core';
import { MarketplaceIcon, HourGlassLargeIcon } from 'selfkey-ui';

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

export const MarketplaceCorporatePreviewContainer = withStyles(styles)(({ classes }) => (
	<Grid
		id="viewMarketplace"
		container
		direction="column"
		justify="space-between"
		alignItems="stretch"
	>
		<Grid container item className={classes.header} xs={12} direction="row" alignItems="center">
			<Grid item>
				<MarketplaceIcon className={classes.headerIcon} />
			</Grid>
			<Grid item>
				<Typography variant="h1">SelfKey Corporate Marketplace</Typography>
			</Grid>
		</Grid>
		<Grid container xs={12}>
			<hr className={classes.hr} />
		</Grid>
		<Grid item id="body" xs={12} alignItems="center" className={classes.content}>
			<HourGlassLargeIcon />
			<Typography variant="h1">Coming Soon</Typography>
			<Typography variant="body1" color="secondary" gutterBottom>
				We are woking with our partners to bring services specially catered for your
				business needs.
			</Typography>
			<Typography variant="subtitle2" color="secondary" gutterBottom>
				Please switch to your personal profile, from the dropdown menu, if you want to
				access the individual marketplace instead.
			</Typography>
		</Grid>
	</Grid>
));

export default MarketplaceCorporatePreviewContainer;
