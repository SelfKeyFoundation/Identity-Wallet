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
	/* tooltip: tooltip, */
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
								/>
							</Grid>
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
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
});

export { CorporateShareholding };
export default CorporateShareholding;
