import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { ProgramPrice } from '../../common/program-price';

const style = theme => ({
	serviceCost: {
		marginBottom: theme.spacing(3),
		paddingBottom: theme.spacing(4),
		width: '100%'
	},
	priceTable: {
		background: '#313D49',
		margin: theme.spacing(3, 0, 0),
		padding: theme.spacing(3)
	},
	priceRow: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		padding: theme.spacing(1, 0),
		'& div.rowItem': {
			color: '#FFF',
			width: '33%'
		},
		'& div.price': {
			color: '#00C0D9',
			fontWeight: 'bold',
			textAlign: 'right',
			'& .time': {
				marginTop: theme.spacing(1)
			}
		},
		'& div.time': {
			fontSize: '13px'
		},
		'& div.rowItem.transactionFee': {
			color: theme.palette.secondary.main
		}
	},
	bold: {
		fontWeight: 600
	}
});

export const NotariesServiceCost = withStyles(style)(
	({ classes, selectedDocuments, price, keyRate, gasEthFee, gasUsdFee }) => (
		<div className={classes.serviceCost}>
			<Typography variant="h2">Service Costs</Typography>
			<div className={classes.priceTable}>
				<div className={classes.priceRow}>
					<div className="rowItem">
						<Typography variant="h2">Cost</Typography>
					</div>
					<div className="rowItem price">
						<ProgramPrice
							price={price}
							label={`${selectedDocuments.length} x $`}
							keyLabel={`${selectedDocuments.length} x `}
							rate={keyRate}
						/>
					</div>
					<div className="rowItem price">
						<ProgramPrice
							price={selectedDocuments.length * price}
							label={`Total: $`}
							rate={keyRate}
						/>
					</div>
				</div>
				<div className={classes.priceRow}>
					<div className="rowItem">
						<Typography variant="body2" color="secondary">
							Network Transaction Fee
						</Typography>
					</div>
					<div className="rowItem time" />
					<div className="rowItem price">
						<Typography className={classes.bold} variant="body2" color="primary">
							$ {gasUsdFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
						</Typography>
						<Typography variant="subtitle2" color="secondary">
							{gasEthFee} ETH
						</Typography>
					</div>
				</div>
			</div>
		</div>
	)
);
