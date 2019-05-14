import React from 'react';
import { Grid, withStyles, Typography } from '@material-ui/core';
import { MarketplaceIcon } from 'selfkey-ui';

import { MarketplaceCategory } from './category';

const styles = theme => ({
	header: {
		'& h1': {
			marginLeft: '20px'
		},
		'& svg': {
			marginLeft: '20px'
		},
		width: '100%',
		height: '120px'
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
	}
});

const getItems = items => {
	return items.map((item, index) => {
		return (
			<MarketplaceCategory
				key={index}
				title={item.title}
				description={item.description}
				active={item.active}
				svgIcon={item.svgIcon}
				learnMoreAction={item.learnMoreAction}
			/>
		);
	});
};

export const MarketplaceCategoriesList = withStyles(styles)(({ classes, children, items }) => (
	<Grid container direction="column" justify="space-between" alignItems="stretch" spacing={24}>
		<Grid container item className={classes.header} xs={12} direction="row" alignItems="center">
			<Grid item>
				<MarketplaceIcon className={classes.headerIcon} />
			</Grid>
			<Grid item>
				<Typography variant="h1">SelfKey Marketplace</Typography>
			</Grid>
		</Grid>
		<Grid container xs={12} style={{ padding: '0 30px' }}>
			<hr className={classes.hr} />
		</Grid>
		<Grid item id="body" xs={12}>
			<Grid container direction="row" justify="space-evenly" alignItems="flex-start">
				{getItems(items)}
			</Grid>
		</Grid>
	</Grid>
));

export default MarketplaceCategoriesList;
