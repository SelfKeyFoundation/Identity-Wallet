import React, { Component } from 'react';
import injectSheet from 'react-jss';
// import ProgramListItem from '../../common/program-list-item';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { GreenTick, DeniedTick } from 'selfkey-ui';

// FIXME: how to load this dynamically from the api data?
const TAX_COLUMNS = [
	[
		'Offshore Income Tax Exemption',
		'Offshore capital gains tax exemption',
		'Offshore dividends tax exemption',
		'CFC Rules',
		'Thin Capitalisation Rules',
		'Patent Box',
		'Tax Incentives & Credits',
		'Property Tax',
		'Wealth Tax',
		'Estate inheritance tax',
		'Transfer tax',
		'Capital Duties'
	],
	[
		'Offshore Income Tax Rate',
		'Corporate Tax Rate',
		'Capital Gains Tax Rate',
		'Dividends Received',
		'Dividends Withholding Tax Rate',
		'Interests Withholding Tax Rate',
		'Royalties Withholding Tax Rate',
		'Losses carryback (years)',
		'Losses carryforward (years)'
	],
	[
		'Personal Income Tax Rate',
		'VAT Rate',
		'Inventory methods permitted',
		'Tax time (hours)',
		'Tax payments per year',
		'Total Corporation Tax Burden',
		'Social Security Employee',
		'Social Security Employer'
	]
];

const styles = {
	booleanProp: {
		'& h5': {
			fontWeight: 'normal'
		}
	},
	textProp: {
		'& h5': {
			fontWeight: 'normal',
			display: 'inline-block'
		},
		'& div': {
			display: 'inline-block'
		},
		'& h5.value': {
			background: 'linear-gradient(to bottom, #0abbd0 0%, #09a8ba 100%)',
			padding: '1px 6px',
			borderRadius: '3px',
			fontWeight: 'bold',
			marginRight: '1em'
		}
	}
};

class IncorporationsTaxView extends Component {
	render() {
		const { classes, data } = this.props;
		console.log(data);
		return (
			<Grid container justify="left" alignItems="left">
				<div>
					<List>
						{TAX_COLUMNS[0].map(id => (
							<ListItem key={id} className={classes.booleanProp}>
								{data[id] ? <GreenTick /> : <DeniedTick />}
								<Typography variant="h5" gutterBottom>
									{id}
								</Typography>
							</ListItem>
						))}
					</List>
				</div>
				<div>
					<List>
						{TAX_COLUMNS[1]
							.filter(id => data[id])
							.map(id => (
								<ListItem key={id} className={classes.textProp}>
									<Typography variant="h5" gutterBottom className="value">
										{data[id]}
									</Typography>
									<Typography variant="h5" gutterBottom>
										{id}
									</Typography>
								</ListItem>
							))}
					</List>
				</div>
				<div>
					<List>
						{TAX_COLUMNS[2]
							.filter(id => data[id])
							.map(id => (
								<ListItem key={id} className={classes.textProp}>
									<Typography variant="h5" gutterBottom className="value">
										{data[id]}
									</Typography>
									<Typography variant="h5" gutterBottom>
										{id}
									</Typography>
								</ListItem>
							))}
					</List>
				</div>
			</Grid>
		);
	}
}

export default injectSheet(styles)(IncorporationsTaxView);
