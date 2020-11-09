import React from 'react';
import { Grid, Typography, Table, TableHead, TableBody, TableCell } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import { BackButton, GridIcon, LargeTableHeadRow, List2Icon, primaryTint } from 'selfkey-ui';
import { ExchangesListItem } from './exchanges-list-item';
import { ExchangesNewListItem } from './exchanges-new-list-item';
import { PageLoading } from '../common';
import { featureIsEnabled } from '../../../common/feature-flags';

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
		'& h1': {
			marginLeft: theme.spacing(2)
		},
		height: '120px',
		marginBottom: theme.spacing(4),
		width: '100%'
	},
	headerContent: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		marginTop: theme.spacing(9)
	},
	content: {
		margin: theme.spacing(6, 0, 0),
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
		left: '75px',
		position: 'absolute'
	},
	listContent: {
		borderTop: 'solid 1px #475768',
		margin: theme.spacing(0),
		width: '100%'
	},
	icon: {
		padding: theme.spacing(0)
	},
	unlockIcon: {
		marginRight: theme.spacing(1)
	},
	divider: {
		backgroundColor: '#475768',
		marginBottom: theme.spacing(3)
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

const getServicesInList = (items, viewAction) => {
	const allFees = allFeesEmpty(items);
	return items.map(item => {
		return (
			<React.Fragment key={item.id || item.name}>
				<ExchangesListItem
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

const getServicesInGrid = (items, viewAction) => {
	const allFees = allFeesEmpty(items);
	return items.map(item => {
		return (
			<ExchangesNewListItem
				key={item.id || item.name}
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
				partnershipVisibility={false}
			/>
		);
	});
};

const listView = (classes, items, viewAction) => {
	return (
		<React.Fragment>
			<Table>
				<TableHead>
					<LargeTableHeadRow>
						<TableCell className={classes.icon}>&nbsp;</TableCell>
						<TableCell style={{ paddingLeft: '16px' }}>
							<Typography variant="overline">Exchange</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="overline">Location</Typography>
						</TableCell>
						<TableCell className={allFeesEmpty(items) ? classes.hidden : null}>
							<Typography variant="overline">Fees</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="overline">Fiat Supported</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="overline">Fiat Payments</Typography>
						</TableCell>
						<TableCell style={{ padding: '8px', minWidth: '200px' }}>
							<Typography variant="overline">Excluded Residents</Typography>
						</TableCell>
						<TableCell>&nbsp;</TableCell>
					</LargeTableHeadRow>
				</TableHead>
				<TableBody>{getServicesInList(items, viewAction)}</TableBody>
			</Table>
		</React.Fragment>
	);
};

const gridView = (classes, items, viewAction) => {
	return <div className={classes.items}>{getServicesInGrid(items, viewAction)}</div>;
};

export const ExchangesList = withStyles(styles)(
	({
		classes,
		children,
		category,
		items,
		backAction,
		viewAction,
		isLoading,
		exchangesListLayoutChange,
		selectedType = 'Grid'
	}) => (
		<Grid container>
			<Grid item className={classes.backButtonContainer}>
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
							<Grid container alignItems="center">
								<Grid item>{category.icon}</Grid>
								<Grid item>
									<Typography variant="h1">{category.title}</Typography>
								</Grid>
							</Grid>

							{featureIsEnabled('exchangesMarketplace') ? (
								<Grid container justify="flex-end">
									<Grid item>
										<ToggleButtonGroup
											exclusive
											onChange={exchangesListLayoutChange}
											value={selectedType}
										>
											<ToggleButton value="Grid">
												<GridIcon
													fill={
														selectedType === 'Grid' ? primaryTint : null
													}
												/>
											</ToggleButton>
											<ToggleButton value="List">
												<List2Icon
													fill={
														selectedType === 'List' ? primaryTint : null
													}
												/>
											</ToggleButton>
										</ToggleButtonGroup>
									</Grid>
								</Grid>
							) : null}
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
							{featureIsEnabled('exchangesMarketplace') && !isLoading
								? selectedType === 'List'
									? listView(classes, items, viewAction)
									: gridView(classes, items, viewAction)
								: listView(classes, items, viewAction)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
);

export default ExchangesList;
