import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { H1, MarketplaceIcon } from 'selfkey-ui';

import { MarketplaceCategory } from './category';

const styles = theme => ({
	header: {
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: '38px'
	},
	headerTitle: {
		paddingLeft: '21px'
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
	<Grid container justify="center" alignItems="center">
		<Grid item id="header" className={classes.header} xs={12}>
			<MarketplaceIcon />
			<H1 className={classes.headerTitle}>SelfKey Marketplace</H1>
		</Grid>
		<Grid item id="body" xs={12}>
			<Grid container direction="row" justify="space-evenly" alignItems="center">
				{getItems(items)}
			</Grid>
		</Grid>
	</Grid>
));

export default MarketplaceCategoriesList;
