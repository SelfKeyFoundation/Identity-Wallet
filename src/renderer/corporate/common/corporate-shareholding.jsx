import React from 'react';
import { Grid, CardHeader, Card, CardContent, Typography } from '@material-ui/core';
import { Chart } from 'react-google-charts';
import { CheckMaIcon, AttributeAlertIcon, EditTransparentIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/core';

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
	}
});

const chartOptions = {
	backgroundColor: 'transparent',
	title: '',
	chartArea: { left: 15, top: 15, bottom: 15, right: 15 },
	pieHole: 0.7,
	pieSliceBorderColor: 'none',
	colors: ['#46dfba', '#46b7df', '#238db4', '#1d7999', '#0e4b61'],
	legend: {
		position: 'none'
	},
	fontSize: 13,
	pieSliceText: 'none',
	/* tooltip: tooltip, */
	animation: {
		startup: true
	}
};

const getChartData = cap => {
	const data = [['Content', 'percents']];
	console.log(cap);
	const dataPoints = cap.map(shareholder => [shareholder.name, shareholder.shares]);
	console.log(data.concat(dataPoints));
	return data.concat(dataPoints);
};

const selectEvent = {
	eventName: 'select',
	callback: ({ chartWrapper }) => {
		const selection = chartWrapper.getChart().getSelection();
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

let pieChartRef = null;

const CorporateShareholding = withStyles(styles)(props => {
	const { classes, cap = [] } = props;
	return (
		<Grid container direction="column" spacing={32} className={classes.cardContainer}>
			<Grid item>
				<Card>
					<CardHeader title="Shareholding" className={classes.regularText} />
					<hr className={classes.hr} />
					<CardContent>
						<Grid container alignItems="flex-start" spacing={0}>
							<Grid item xs={8}>
								<Chart
									chartType="PieChart"
									data={getChartData(cap)}
									options={chartOptions}
									graph_id="PieChart"
									width="100%"
									height="300px"
									legend_toggle
									chartEvents={[selectEvent, readyEvent]}
									ref={c => {
										pieChartRef = c;
									}}
								/>
							</Grid>
							<Grid item xs={4} />
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
});

export { CorporateShareholding };
export default CorporateShareholding;
