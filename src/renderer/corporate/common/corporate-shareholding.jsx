import React from 'react';
import { Grid, CardHeader, Card, CardContent, withStyles } from '@material-ui/core';
import { Chart } from 'react-google-charts';

const styles = theme => ({
	cardContainer: {
		maxWidth: '550px'
	},
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	card: {},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	attr: {
		margin: '0.5em',
		display: 'block',
		'& .label': {
			display: 'inline-block',
			minWidth: '12em'
		},
		'& h5': {
			display: 'inline-block'
		},
		'& svg': {
			marginRight: '0.5em',
			verticalAlign: 'middle'
		}
	},
	legend: {
		alignSelf: 'flex-end',
		marginBottom: '1em',
		'& > div': {
			display: 'flex',
			alignItems: 'center',
			marginTop: '0.5em'
		},
		'& span': {
			marginLeft: '0.5em'
		}
	},
	coloredBox: {
		width: '22px !important',
		height: '8px !important',
		borderRadius: '8px !important',
		position: 'relative'
	},
	chartWrap: {
		display: 'flex',
		'& div.google-visualization-tooltip': {
			backgroundColor: '#1F2830',
			border: '1px solid #43505B',
			boxShadow: 'none',
			top: '40px !important',
			'& .google-visualization-tooltip-item span': {
				fontSize: '13px !important'
			},
			'& .google-visualization-tooltip-item-list li:first-child span': {
				color: '#93B0C1 !important'
			},
			'& .google-visualization-tooltip-item-list li:nth-child(2) span': {
				color: '#FFFFFF !important'
			}
		}
	}
});

const getColors = () => {
	// TODO: generate random colors algorithm to account for unknown number of shareholders
	return ['#46dfba', '#46b7df', '#238db4', '#1d7999', '#0e4b61'];
};

const chartOptions = {
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
	}
};

const getChartData = cap => {
	const data = [['Content', 'percents']];
	const dataPoints = cap.map(shareholder => [shareholder.name, shareholder.shares]);
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
	const { classes, cap = [] } = props;
	return (
		<Card>
			<CardHeader title="Shareholding" className={classes.regularText} />
			<hr className={classes.hr} />
			<CardContent>
				<div className={classes.chartWrap}>
					<Chart
						chartType="PieChart"
						data={getChartData(cap)}
						options={chartOptions}
						graph_id="PieChart"
						width="100%"
						height="300px"
						legend_toggle
						chartEvents={[selectEvent, readyEvent]}
					/>
					<Grid item xs={4} className={classes.legend}>
						{cap.map((shareholder, index) => (
							<div key={`shareholder-${index}`}>
								<div
									className={classes.coloredBox}
									style={{ backgroundColor: getColors()[index] }}
								/>
								<span>{shareholder.name}</span>
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
