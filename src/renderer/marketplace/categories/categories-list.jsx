import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { MarketplaceIcon } from 'selfkey-ui';
import { MarketplaceCategory, NewMarketplaceCategory } from './category';
import { featureIsEnabled } from 'common/feature-flags';

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
		margin: '0 0 24px',
		width: '100%'
	}
});

const getItems = items => {
	return items.map((item, index) => {
		return featureIsEnabled('newMarketplaceLayout') ? (
			<NewMarketplaceCategory
				key={index}
				title={item.title}
				description={item.description}
				active={item.active}
				svgIcon={item.svgIcon}
				learnMoreAction={item.learnMoreAction}
				index={index}
			/>
		) : (
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
				<Typography variant="h1">SelfKey Marketplace</Typography>
			</Grid>
		</Grid>
		<Grid container>
			<hr className={classes.hr} />
		</Grid>
		<Grid item id="body" xs={12}>
			<Grid
				container
				direction="row"
				justify={featureIsEnabled('newMarketplaceLayout') ? '' : 'space-between'}
				alignItems="flex-start"
			>
				{getItems(items)}
			</Grid>
		</Grid>
	</Grid>
));

export default MarketplaceCategoriesList;
