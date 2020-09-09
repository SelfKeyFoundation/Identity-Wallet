import React from 'react';
import { Grid, Typography, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { BackButton, GridIcon, List2Icon, primaryTint } from 'selfkey-ui';
import { ExchangesNewListItem } from './exchanges-new-list-item';
import { MarketplaceDisclaimer } from '../common/disclaimer';
import { PageLoading } from '../common';

const styles = theme => ({
	wrapper: {
		width: '1074px'
	},
	'@media screen and (min-width: 1230px)': {
		wrapper: {
			width: '1140px'
		}
	},
	header: {
		borderBottom: 'solid 1px #475768',
		'& h1': {
			marginLeft: '20px'
		},
		width: '100%',
		height: '120px'
	},
	headerContent: {
		marginTop: '50px',
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap'
	},
	content: {
		marginTop: '30px',
		margin: 0,
		width: '100%'
	},
	button: {
		color: '#93b0c1',
		borderColor: '#3b4a5a',
		'&:disabled': {
			color: '#48565f'
		}
	},
	backButtonContainer: {
		top: '120px'
	},
	listContent: {
		margin: 0,
		width: '100%'
	},
	icon: {
		padding: 0
	},
	unlockIcon: {
		marginRight: '10px'
	},
	disclaimer: {
		margin: '40px auto',
		textAlign: 'center',
		'& h6': {
			maxWidth: '80%',
			margin: 'auto'
		}
	},
	divider: {
		backgroundColor: '#475768',
		marginBottom: '20px'
	},
	hidden: {
		display: 'none'
	},
	items: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	}
});

const allFeesEmpty = items => {
	let emptyFees = true;
	items.map(item => {
		return item.fees ? (emptyFees = false) : null;
	});
	return emptyFees;
};

const getServices = (items, viewAction) => {
	const allFees = allFeesEmpty(items);
	return items.map(item => {
		return (
			<React.Fragment key={item.id || item.name}>
				<ExchangesNewListItem
					id={item.id || item.name}
					name={item.name}
					location={item.data.location || '-'}
					fees={item.fees || '-'}
					fiatSupported={item.data.fiatSupported || '-'}
					fiatPayments={item.data.fiatPayments || '-'}
					excludedResidents={item.data.excludedResidents || '-'}
					logoUrl={item.data.logo ? item.data.logo[0].url : false}
					status={item.status}
					viewAction={viewAction}
					allFeesEmpty={allFees}
				/>
			</React.Fragment>
		);
	});
};

export const ExchangesNewList = withStyles(styles)(
	({ classes, children, category, items, backAction, viewAction, isLoading, value = 'List' }) => (
		<Grid container>
			<Grid item>
				<BackButton onclick={backAction} />
			</Grid>
			<Grid item>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="center"
					className={classes.wrapper}
				>
					<Grid item id="header" className={classes.header} xs={12}>
						<Grid
							container
							direction="row"
							justify="space-between"
							alignItems="center"
							className={classes.headerContent}
						>
							<Grid container justify="space-between" wrap="nowrap" align="center">
								<Grid container align="center">
									<Grid item>{category.icon}</Grid>
									<Grid item>
										<Typography variant="h1">{category.title}</Typography>
									</Grid>
								</Grid>
								<Grid container justify="flex-end">
									<Grid item>
										<ToggleButtonGroup exclusive value={value}>
											<ToggleButton value="Grid">
												<GridIcon
													fill={value === 'Grid' ? primaryTint : null}
												/>
											</ToggleButton>
											<ToggleButton value="List">
												<List2Icon
													fill={value === 'List' ? primaryTint : null}
												/>
											</ToggleButton>
										</ToggleButtonGroup>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid item className={classes.listContent} xs={12}>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							spacing={3}
							className={classes.content}
						>
							{isLoading && <PageLoading />}
							{!isLoading && (
								<React.Fragment>
									<div className={classes.items}>
										{getServices(items, viewAction)}
									</div>
									<div className={classes.disclaimer}>
										<Divider className={classes.divider} />
										<MarketplaceDisclaimer />
									</div>
								</React.Fragment>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
);

export default ExchangesNewList;
