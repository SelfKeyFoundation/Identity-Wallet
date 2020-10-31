import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography, IconButton, Grid } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import { LargeTableHeadRow, TagTableCell, Tag, KeyTooltip, InfoTooltip } from 'selfkey-ui';
import { DetailsIconButton, ProgramPrice, FlagCountryName } from '../../common';

const styles = theme => ({
	table: {
		'& td': {
			padding: theme.spacing(1, 2)
		},
		'& th': {
			padding: theme.spacing(2)
		}
	},
	tableHeaderRow: {
		'& th': {
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '15px',
			fontWeight: 'bold',
			color: '#7F8FA4',
			textTransform: 'uppercase',
			border: 'none'
		}
	},
	costCell: {
		width: '70px'
	},
	eligibilityCell: {
		maxWidth: '245px',
		width: '245px'
	},
	eligibilityCellBody: {
		alignItems: 'center',
		display: 'flex',
		flexWrap: 'wrap',
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
		whiteSpace: 'normal',
		lineHeight: '19px',
		maxWidth: '245px'
	},
	flagCell: {
		width: '10px'
	},
	regionCell: {
		minWidth: '100px',
		lineHeight: '19px',
		whiteSpace: 'normal',
		padding: theme.spacing(0, 2)
	},
	detailsCell: {
		color: '#00C0D9',
		'& span': {
			cursor: 'pointer'
		},
		'& button': {
			maxWidth: '15px',
			minWidth: '15px',
			padding: theme.spacing(0),
			width: '15px'
		}
	},
	goodForCell: {
		width: '250px',
		padding: theme.spacing(2),
		whiteSpace: 'normal'
	},
	minDepositCell: {
		width: '85px'
	},
	personalVisitCell: {
		minWidth: '120px'
	},
	personalVisitText: {
		alignItems: 'center',
		display: 'flex',
		'& svg': {
			height: '15px !important',
			width: '15px !important'
		}
	}
});

const isPersonalVisitRequired = accounts => {
	return Object.keys(accounts).reduce((required, accountId) => {
		const account = accounts[accountId];
		return required && account.personalVisitRequired;
	}, true);
};

const BankingOffersRow = withStyles(styles)(({ classes, bank, onDetails, keyRate }) => {
	const data = bank.data;
	return (
		<TableRow className={classes.tableRow}>
			<TableCell className={classes.flagCell}>
				<FlagCountryName code={data.countryCode} size="small" />
			</TableCell>
			<TableCell className={classes.regionCell}>
				<Typography variant="h6">{data.region}</Typography>
			</TableCell>
			<TableCell>
				<div className={classes.eligibilityCellBody}>
					{data.eligibility &&
						data.eligibility.map((tag, index) => (
							<Typography variant="h6" key={tag}>
								{tag}
								{index !== data.eligibility.length - 1 ? ',' : ''}
							</Typography>
						))}
				</div>
			</TableCell>
			<TableCell className={classes.minDepositCell}>
				<Typography variant="h6">{data.minDeposit}</Typography>
			</TableCell>
			<TagTableCell className={classes.goodForCell}>
				<Grid container>
					{data.goodFor && data.goodFor.map(tag => <Tag key={tag}>{tag}</Tag>)}
				</Grid>
			</TagTableCell>
			<TableCell className={classes.personalVisitCell}>
				{isPersonalVisitRequired(data.accounts) ? (
					<Typography variant="h6">Yes</Typography>
				) : (
					<Typography variant="h6">No</Typography>
				)}
			</TableCell>
			<TableCell className={classes.costCell}>
				<ProgramPrice label="$" price={bank.price} rate={keyRate} />
			</TableCell>
			<TableCell className={classes.detailsCell}>
				<DetailsIconButton
					onClick={() => onDetails(bank)}
					id={`details${data.countryCode}`}
				/>
			</TableCell>
		</TableRow>
	);
});

const BankingOffersTable = withStyles(styles)(
	({ classes, accountType, keyRate, inventory = [], onDetails, className }) => {
		return (
			<Table className={classNames(classes.table, className)}>
				<TableHead>
					<LargeTableHeadRow>
						<TableCell className={classes.flagCell} />
						<TableCell className={classes.regionCell}>
							<Typography variant="overline">Region</Typography>
						</TableCell>
						<TableCell className={classes.eligibilityCell}>
							<Typography variant="overline">Eligibility</Typography>
						</TableCell>
						<TableCell className={classes.minDepositCell}>
							<Typography variant="overline">Min. Deposit</Typography>
						</TableCell>
						<TableCell className={classes.goodForCell}>
							<Typography variant="overline">Good for</Typography>
						</TableCell>
						<TableCell className={classes.personalVisitCell}>
							<Typography variant="overline" className={classes.personalVisitText}>
								Personal Visit
								<KeyTooltip
									interactive
									placement="top-start"
									className={classes.tooltip}
									TransitionProps={{ timeout: 0 }}
									title={
										<React.Fragment>
											<span>
												Personal visit is shown as required if all the banks
												from that region request it.{' '}
											</span>
										</React.Fragment>
									}
								>
									<IconButton aria-label="Info">
										<InfoTooltip />
									</IconButton>
								</KeyTooltip>
							</Typography>
						</TableCell>
						<TableCell className={classes.costCell}>
							<Typography variant="overline">Cost</Typography>
						</TableCell>
						<TableCell className={classes.detailsCell} />
					</LargeTableHeadRow>
				</TableHead>
				<TableBody className={classes.tableBodyRow}>
					{inventory.map(bank => (
						<BankingOffersRow
							bank={bank}
							accountType={accountType}
							key={bank.id}
							keyRate={keyRate}
							onDetails={onDetails}
						/>
					))}
				</TableBody>
			</Table>
		);
	}
);

export default BankingOffersTable;
export { BankingOffersTable };
