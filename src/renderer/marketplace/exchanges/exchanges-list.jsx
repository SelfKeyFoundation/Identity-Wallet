import React from 'react';
import {
	Grid,
	Typography,
	Divider,
	Table,
	TableHead,
	TableBody,
	TableCell
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { LargeTableHeadRow, BackButton } from 'selfkey-ui';
import { ExchangesListItem } from './exchanges-list-item';
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

export const ExchangesList = withStyles(styles)(
	({ classes, children, category, items, backAction, viewAction, isLoading }) => (
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
							<Grid container>
								<Grid item>{category.icon}</Grid>
								<Grid item>
									<Typography variant="h1">{category.title}</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid item className={classes.listContent} xs={12}>
						<Grid
							container
							direction="row"
							justify="start"
							alignItems="center"
							spacing={3}
							className={classes.content}
						>
							{isLoading && <PageLoading />}
							{!isLoading && (
								<React.Fragment>
									<Table>
										<TableHead>
											<LargeTableHeadRow>
												<TableCell className={classes.icon}>
													&nbsp;
												</TableCell>
												<TableCell style={{ paddingLeft: '15px' }}>
													<Typography variant="overline">
														Exchange
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="overline">
														Location
													</Typography>
												</TableCell>
												<TableCell
													className={
														allFeesEmpty(items) ? classes.hidden : null
													}
												>
													<Typography variant="overline">Fees</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="overline">
														Fiat Supported
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="overline">
														Fiat Payments
													</Typography>
												</TableCell>
												<TableCell style={{ padding: '10px' }}>
													<Typography variant="overline">
														Excluded Residents
													</Typography>
												</TableCell>
												<TableCell>&nbsp;</TableCell>
											</LargeTableHeadRow>
										</TableHead>

										<TableBody>{getServices(items, viewAction)}</TableBody>
									</Table>
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

export default ExchangesList;
