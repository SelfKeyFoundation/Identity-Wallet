import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({
	resumeTable: {
		'& div': {
			padding: '10px 15px',
			width: '115px'
		},
		'& label': {
			fontSize: '13px',
			color: '#93B0C1'
		},
		'& h4': {
			marginTop: '0.25em',
			minHeight: '30px',
			color: '#00C0D9'
		}
	},
	programBrief: {
		display: 'flex',
		border: '1px solid #303C49',
		borderRadius: '4px',
		background: '#2A3540'
	}
});

export const ResumeBox = withStyles(styles)(props => {
	const { tax, classes } = props;

	return (
		<div className={classes.programBrief}>
			<div className={classes.resumeTable}>
				<div>
					<label>Offshore Tax</label>
					<Typography variant="h4" gutterBottom>
						{tax['Offshore Income Tax Rate'] || '--'}
					</Typography>
				</div>
				<div>
					<label>Dividends received</label>
					<Typography variant="h4" gutterBottom>
						{tax['Dividends Received'] || '--'}
					</Typography>
				</div>
			</div>
			<div className={classes.resumeTable}>
				<div>
					<label>Corp Income</label>
					<Typography variant="h4" gutterBottom>
						{tax['Corporate Tax Rate'] || '--'}
					</Typography>
				</div>
				<div>
					<label>Dividends paid</label>
					<Typography variant="h4" gutterBottom>
						{tax['Dividends Withholding Tax Rate'] || '--'}
					</Typography>
				</div>
			</div>
			<div className={classes.resumeTable}>
				<div>
					<label>Capital Gains</label>
					<Typography variant="h4" gutterBottom>
						{tax['Capital Gains Tax Rate'] || '--'}
					</Typography>
				</div>
				<div>
					<label>Royalties paid</label>
					<Typography variant="h4" gutterBottom>
						{tax['Royalties Withholding Tax Rate'] || '--'}
					</Typography>
				</div>
			</div>
			<div className={classes.resumeTable}>
				<div>
					<label>Interests paid</label>
					<Typography variant="h4" gutterBottom>
						{tax['Interests Withholding Tax Rate'] || '--'}
					</Typography>
				</div>
			</div>
		</div>
	);
});
