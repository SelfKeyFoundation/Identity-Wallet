import React from 'react';
import { Typography /*, IconButton */ } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
// import { KeyTooltip, TooltipArrow, InfoTooltip } from 'selfkey-ui';
import { ProgramPrice } from '../../common/program-price';

const style = theme => ({
	serviceCost: {
		marginBottom: '20px',
		paddingBottom: '30px',
		width: '100%'
	},
	priceTable: {
		background: '#313D49',
		margin: '20px 0 0',
		padding: '20px'
	},
	priceRow: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		padding: '10px 0',
		'& div.rowItem': {
			color: '#FFF',
			width: '33%'
		},
		'& div.price': {
			color: '#00C0D9',
			fontWeight: 'bold',
			textAlign: 'right',
			'& .time': {
				marginTop: '5px'
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
							{Number.parseFloat(gasEthFee).toFixed(8)} ETH
						</Typography>
					</div>
				</div>
			</div>
		</div>
	)
);
