import React from 'react';
import { Grid, CardHeader, Card, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Chart } from 'react-google-charts';
import { getProfileName, getMemberEquity } from './common-helpers.jsx';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: theme.spacing(1, 2)
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	legend: {
		alignSelf: 'flex-end',
		marginBottom: theme.spacing(2),
		'& > div': {
			display: 'flex',
			alignItems: 'center',
			marginTop: theme.spacing(1)
		},
		'& span': {
			marginLeft: theme.spacing(1)
		}
	},
	coloredBox: {
		borderRadius: '8px !important',
		height: '8px !important',
		position: 'relative',
		width: '22px !important'
	},
	chartWrap: {
		display: 'flex',
		'& div.google-visualization-tooltip': {
			alignItems: 'center',
			backgroundColor: '#1F2830',
			border: '1px solid #43505B',
			boxShadow: 'none',
			color: '#FFFFFF !important',
			display: 'flex',
			fontSize: '13px !important',
			padding: theme.spacing(1),
			top: '40px !important',
			'& span': {
				color: '#93B0C1 !important',
				marginLeft: theme.spacing(1)
			}
		}
	}
});

const getColors = () => {
	// TODO: generate random colors algorithm to account for unknown number of shareholders
	return ['#46dfba', '#46b7df', '#238db4', '#1d7999', '#0e4b61'];
};

const getChartOptions = unassignedIndex => {
	let slices = null;

	if (unassignedIndex) {
		slices = {
			[unassignedIndex - 1]: { color: '#999999' }
		};
	}
	return {
		backgroundColor: 'transparent',
		title: '',
		chartArea: { left: 15, top: 15, bottom: 15, right: 15 },
		pieHole: 0.7,
		pieSliceBorderColor: 'none',
		colors: getColors(),
		legend: {
			position: 'none'
		},
		fontSize: 13,
		pieSliceText: 'none',
		tooltip: {
			isHtml: true
		},
		animation: {
			startup: true
		},
		slices
	};
};

const getChartData = shareholders => {
	const data = [['Content', 'percents', { role: 'tooltip', type: 'string', p: { html: true } }]];
	const total = shareholders.reduce((acc, curr) => acc + getMemberEquity(curr), 0);
	const dataPoints = shareholders.map(s => [
		getProfileName(s),
		getMemberEquity(s),
		`${getProfileName(s)}<span>(${getMemberEquity(s)}%)</span>`
	]);
	// Add a unknown data point if total equity is below 100
	if (total < 100) {
		dataPoints.push(['Unassigned', 100 - total, `<span>Unassigned</span>`]);
	}
	return data.concat(dataPoints);
};

const selectEvent = {
	eventName: 'select',
	callback: ({ chartWrapper }) => {
		// const selection = chartWrapper.getChart().getSelection();
	}
};

const readyEvent = {
	eventName: 'ready',
	callback: ({ chartWrapper, google }) => {
		const chart = chartWrapper.getChart();
		google.visualization.events.addListener(chart, 'onmouseover', e => {});
		google.visualization.events.addListener(chart, 'onmouseout', e => {});
	}
};

/*
let pieChartRef = null;
ref={c => {
	pieChartRef = c;
}}
*/

const CorporateShareholding = withStyles(styles)(props => {
	const { classes, members = [] } = props;
	const shareholders = members.filter(m => m.identity.equity);
	if (shareholders.length === 0) {
		return null;
	}
	const data = getChartData(shareholders);
	const unassignedIndex = data.findIndex(d => d[0] === 'Unassigned');
	const options = getChartOptions(unassignedIndex);

	return (
		<Card>
			<CardHeader title="Shareholding" className={classes.regularText} />
			<hr className={classes.hr} />
			<CardContent>
				<div className={classes.chartWrap}>
					<Chart
						chartType="PieChart"
						data={getChartData(shareholders)}
						options={options}
						graph_id="PieChart"
						width="100%"
						height="300px"
						legend_toggle
						chartEvents={[selectEvent, readyEvent]}
					/>
					<Grid item xs={4} className={classes.legend}>
						{shareholders.map((shareholder, index) => (
							<div key={`shareholder-${index}`}>
								<div
									className={classes.coloredBox}
									style={{ backgroundColor: getColors()[index] }}
								/>
								<span>{getProfileName(shareholder)}</span>
							</div>
						))}
					</Grid>
				</div>
			</CardContent>
		</Card>
	);
});

export { CorporateShareholding };
export default CorporateShareholding;
