import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { MarketplaceIcon, HourGlassLargeIcon } from 'selfkey-ui';

const styles = theme => ({
	header: {
		'& h1': {
			marginLeft: theme.spacing(2)
		},
		'& svg': {
			marginLeft: theme.spacing(0)
		},
		marginBottom: theme.spacing(2),
		height: '40px',
		width: '100%'
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
				We are working with our partners to bring services specially catered for your
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
