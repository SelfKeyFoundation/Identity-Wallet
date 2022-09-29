import React from 'react';
import { Chart } from 'react-google-charts';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NumberFormat, PriceSummary, EthereumIcon, SelfkeyIcon } from 'selfkey-ui';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { getLocale } from 'common/locale/selectors';
import { getViewAll } from 'common/view-all-tokens/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getVisibleTokens, getTopTokenListSize } from 'common/wallet-tokens/selectors';
import { viewAllOperations } from 'common/view-all-tokens';
import { withStyles } from '@material-ui/styles';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

const styles = () => ({
	paper: {
		backgroundColor: '#131F2A',
		boxShadow: 'none',
		boxSizing: 'border-box',
		height: '100%',
		padding: '16px 30px'
	},
	iconRightSpace: {
		marginRight: '10px'
	},
	coloredBox: {
		borderRadius: '8px !important',
		height: '44px !important',
		position: 'relative',
		width: '44px !important'
	},
	coloredBoxText: {
		position: 'absolute',
		textAlign: 'center',
		cursor: 'default',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)'
	},
	prices: {
		flexGrow: 1,
		margin: 0,
		padding: 0,
		width: 'auto',
		fontWeight: 'bold',
		'& >div': {
			paddingRight: '0 !important'
		}
	},
	texts: {
		fontSize: '18px'
	},
	active: {
		backgroundColor: '#313D49',
		borderRadius: '4px',
		outlineWidth: 0,
		border: 'none',
		padding: '10px'
	},
	chartCenterContainer: {
		position: 'absolute',
		textAlign: 'center',
		cursor: 'default',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)'
	},
	chart: {
		maxWidth: 'initial',
		position: 'relative'
	},
	buttonViewMore: {
		outline: 'none',
		fontSize: '12px',
		color: '#93b0c1',
		cursor: 'pointer',
		textTransform: 'uppercase'
	},
	buttonViewMoreText: {
		borderBottom: '1px dashed #93b0c1'
	},
	expandMore: {
		verticalAlign: 'middle !important'
	},
	textRight: {
		textAlign: 'right'
	},
	smallText: {
		marginTop: '-2px !important',
		color: '#93B0C1',
		'& >div': {
			fontSize: '14px'
		}
	},
	textColor: {
		color: 'rgba(255, 255, 255, 0.7)'
	},
	title: {
		fontSize: '20px',
		paddingTop: '12px'
	},
	chartWrap: {
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
	},
	button: {
		margin: '0 10px'
	},
	token: {
		flexBasis: '48%',
		margin: '13px 0',
		'&:hover': {
			backgroundColor: '#313D49',
			border: 'none',
			borderRadius: '4px',
			cursor: 'pointer',
			outlineWidth: 0
		}
	},
	tokenContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: '30px',
		maxHeight: '250px',
		overflowX: 'hidden',
		overflowY: 'auto'
	},
	tokenName: {
		marginRight: '10px'
	},
	tokenActionButtons: {
		marginBottom: '30px',
		marginTop: '20px'
	},
	flex: {
		display: 'flex',
		'& svg': {
			marginRight: '10px'
		}
	},
	flexContainer: {
		alignItems: 'flex-start',
		display: 'flex',
		justifyContent: 'space-between'
	},
	infoWrap: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%'
	}
});

class ChartContainerComponent extends React.Component {
	DEFAULT_COLLOR = '#2A3540';

	shouldComponentUpdate(nextProps) {
		return nextProps.tokens !== this.props.tokens;
	}

	getChartData = tokens => {
		const data = [['Content', 'percents']];
		let dataPoints = null;
		if (this.props.hasBalance) {
			dataPoints = tokens.map(token => {
				return [token.name, token.balanceInFiat];
			});
		} else {
			dataPoints = [['', 1]]; // Positive value is needed for pie chart.
		}
		return data.concat(dataPoints);
	};

	render() {
		const { events, tokens, hasBalance, colors, classes } = this.props;

		const selectedColors = hasBalance ? colors : [this.DEFAULT_COLLOR];
		let tooltip = hasBalance ? { trigger: 'focus', isHtml: true } : { trigger: 'none' };

		return (
			<div className={classes.chartWrap}>
				<Chart
					chartType="PieChart"
					data={this.getChartData(tokens)}
					options={{
						backgroundColor: 'transparent',
						title: '',
						chartArea: { left: 15, top: 15, bottom: 15, right: 15 },
						pieHole: 0.7,
						pieSliceBorderColor: 'none',
						colors: selectedColors,
						legend: {
							position: 'none'
						},
						fontSize: 13,
						pieSliceText: 'none',
						tooltip: tooltip,
						animation: {
							startup: true
						}
					}}
					graph_id="PieChart"
					width="270px"
					height="270px"
					legend_toggle
					chartEvents={events}
					ref={c => {
						this.pieChart = c;
					}}
				/>
			</div>
		);
	}
}

export const ChartContainer = connect()(withStyles(styles)(ChartContainerComponent));

export class CryptoChartBoxComponent extends React.Component {
	OTHERS_COLOR = '#71a6b8';

	state = {
		activations: this.activations
	};

	constructor(props) {
		super(props);
		this.state = {};
		this.state.activations = (props.tokens || []).map(token => ({ active: false }));
	}

	selectEvent = {
		eventName: 'select',
		callback: ({ chartWrapper }) => {
			const selection = chartWrapper.getChart().getSelection();

			if (!selection || !selection[0]) {
				return;
			}
			const row = selection[0].row;
			const newTokens = this.state.activations.map((_activation, index) => {
				if (index !== row) {
					return { active: false };
				} else {
					this.chart = Chart.chart;
					return { active: true };
				}
			});
			this.setState({ activations: newTokens });
		}
	};

	readyEvent = {
		eventName: 'ready',
		callback: ({ chartWrapper, google }) => {
			const chart = chartWrapper.getChart();
			google.visualization.events.addListener(chart, 'onmouseover', e => {
				const { row } = e;

				const selection = chart.getSelection();
				let newTokens = this.state.activations.slice(0);

				if (newTokens[row] && newTokens[row].active) {
					return;
				}
				if (selection && selection.length && selection[0].row === row) {
					newTokens[row] = { active: false };
					this.setState({ activations: newTokens });
					setTimeout(() => {
						newTokens[row] = { active: true };
						this.setState({ activations: newTokens });
					}, 100);
					return;
				}
				newTokens[row] = { active: true };
				this.setState({ activations: newTokens });
			});
			google.visualization.events.addListener(chart, 'onmouseout', e => {
				const { row } = e;
				const selection = chart.getSelection();
				if (selection && selection.length && selection[0].row === row) {
					return;
				}
				const newTokens = this.state.activations.slice(0);
				newTokens[row] = { active: false };
				this.setState({ activations: newTokens });
			});
		}
	};

	getColors = () => ['#46dfba', '#05538E', '#006CBE', '#006CBE', '#00C0D9'];

	// ETH and KEY have hardcoded colors
	getChartColors = tokens => {
		let colors = [];
		tokens.forEach(token => {
			if (token.symbol === 'ETH') {
				colors.push('#9418DC');
			}
			if (token.symbol === 'KEY' || token.symbol === 'KI') {
				colors.push('#2DA1F8');
			}
		});
		return [...colors, ...this.getColors()];
	};

	getColorByIndex = index => {
		const colors = this.getChartColors(this.props.tokens);
		return colors[index] ? colors[index] : this.OTHERS_COLOR;
	};

	getChartEvents = () => {
		return this.hasBalance() ? [this.selectEvent, this.readyEvent] : [];
	};

	hasBalance = () => {
		let { tokens } = this.props;
		tokens = tokens || [];
		let check = tokens.find(token => {
			return token.balanceInFiat > 0;
		});

		return !!check;
	};

	getTotalBalanceInFiat = tokens => {
		return tokens.reduce((a, b) => {
			return a + b['balanceInFiat'];
		}, 0);
	};

	getTokenIcon(classes, token, index) {
		switch (token.name) {
			case 'Ethereum':
				return <EthereumIcon className={classes.iconRightSpace} />;
			case 'Selfkey':
				return <SelfkeyIcon className={classes.iconRightSpace} />;
			default:
				return (
					<div
						className={`${classes.coloredBox} ${classes.iconRightSpace}`}
						style={{
							backgroundColor: this.getColorByIndex(index)
						}}
					>
						<div className={classes.coloredBoxText}>
							{(token.name || token.symbol).charAt(0)}
						</div>
					</div>
				);
		}
	}

	getTokensLegend(classes, tokens, locale, fiatCurrency, manageTransferAction) {
		return tokens.map((token, index) => {
			return (
				<Grid
					item
					xs={6}
					key={index}
					className={
						this.state.activations[index] && this.state.activations[index].active
							? `${classes.active} ${classes.token}`
							: `${classes.token}`
					}
					onClick={e => manageTransferAction(e, token)}
				>
					<div className={classes.flexContainer}>
						<div>{this.getTokenIcon(classes, token, index)}</div>
						<div className={classes.infoWrap}>
							<Grid container alignItems="flex-start" justify="space-between">
								<Typography
									variant="h2"
									title={token.name}
									className={classes.tokenName}
								>
									{token.name === 'Selfkey' ? 'SelfKey' : token.name}
								</Typography>
								<PriceSummary
									locale={locale}
									style="decimal"
									currency={token.symbol}
									fractionDigits={4}
									className={classes.prices}
									valueClass={classes.texts}
									value={token.balance}
									justify="flex-end"
								/>
							</Grid>
							<Grid container alignItems="flex-start" wrap="nowrap">
								<Typography variant="subtitle1" className={classes.textColor}>
									{token.symbol}
								</Typography>
								<PriceSummary
									locale={locale}
									priceStyle="currency"
									currency={fiatCurrency}
									className={classes.smallText}
									valueClass={classes.texts}
									value={token.balanceInFiat}
									justify="flex-end"
								/>
							</Grid>
						</div>
					</div>
				</Grid>
			);
		});
	}

	toggleViewAll() {
		const { toggleViewAll, viewAll } = this.props;
		if (!toggleViewAll) {
			return;
		}
		toggleViewAll(viewAll);
	}

	getViewAllSection() {
		const { classes, tokens, topTokenListSize, viewAll } = this.props;
		return tokens.length > topTokenListSize ? (
			<Grid item xs={12}>
				<Grid container justify="center">
					<Grid
						item
						className={classes.buttonViewMore}
						onClick={() => this.toggleViewAll()}
					>
						{!viewAll ? (
							<ExpandMore className={classes.expandMore} />
						) : (
							<ExpandLess className={classes.expandMore} />
						)}
						<span className={classes.buttonViewMoreText}>
							{!viewAll ? 'View All' : 'Collapse'}
						</span>
					</Grid>
				</Grid>
			</Grid>
		) : (
			''
		);
	}

	render() {
		const {
			classes,
			locale,
			fiatCurrency,
			tokens,
			manageCryptoAction,
			manageAddTokenAction,
			manageTransferAction
		} = this.props;

		return (
			<Paper className={classes.paper}>
				<Grid container alignItems="center" spacing={2}>
					<Typography variant="h1" className={classes.title}>
						My Tokens
					</Typography>
					<Grid item xs={12}>
						<Grid container justify="center" spacing={0}>
							<Grid item xs={4} className={classes.chart}>
								<ChartContainer
									events={this.getChartEvents()}
									tokens={tokens}
									hasBalance={this.hasBalance()}
									colors={this.getChartColors(tokens)}
								/>
								<div className={classes.chartCenterContainer}>
									<Typography variant="h1">
										<NumberFormat
											locale={locale}
											currency={fiatCurrency}
											style="currency"
											value={this.getTotalBalanceInFiat(tokens)}
										/>
									</Typography>
									<Typography variant="subtitle2" color="secondary">
										Total Value {fiatCurrency}
									</Typography>
								</div>
							</Grid>
						</Grid>
					</Grid>
					<Grid container justify="center" className={classes.tokenActionButtons}>
						<Button
							className={classes.button}
							variant="outlined"
							color="secondary"
							onClick={manageAddTokenAction}
						>
							+ Add Token
						</Button>
						<Button
							className={classes.button}
							variant="outlined"
							color="secondary"
							onClick={manageCryptoAction}
						>
							Manage Tokens
						</Button>
						<Button
							className={classes.button}
							variant="outlined"
							color="secondary"
							onClick={manageTransferAction}
						>
							Send/Receive
						</Button>
					</Grid>
					<Grid
						container
						spacing={2}
						justify="space-between"
						className={classes.tokenContainer}
					>
						{this.getTokensLegend(
							classes,
							tokens,
							locale,
							fiatCurrency,
							manageTransferAction
						)}
					</Grid>
					{this.getViewAllSection()}
				</Grid>
			</Paper>
		);
	}
}

const mapStateToProps = state => {
	return {
		...getLocale(state),
		...getFiatCurrency(state),
		tokens: getVisibleTokens(state),
		topTokenListSize: getTopTokenListSize(state),
		...getViewAll(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(viewAllOperations, dispatch);
};

export const CryptoChartBox = connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(CryptoChartBoxComponent));

export default CryptoChartBox;
