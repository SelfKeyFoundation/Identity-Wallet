import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Grid, Divider, FormGroup, FormControl, Button, Typography } from '@material-ui/core';
import { KycRequirements } from '../../kyc';

import Truncate from 'react-truncate';

const styles = theme => ({
	root: {
		width: '946px',
		height: '100%',
		margin: '50px auto 30px',
		borderRadius: '4px'
	},

	title: {
		margin: '20px'
	},

	icon: {
		marginLeft: '20px'
	},

	header: {
		backgroundColor: '#2a3540',
		border: '1px solid #303C49',
		borderRadius: '4px 4px 0 0'
	},

	body: {
		backgroundColor: '#262F39',
		border: '1px solid #303C49',
		borderRadius: '0 0 4px 4px',
		borderTop: 0,
		color: '#fff',
		fontFamily: 'Lato, arial, sans-serif',
		fontSize: '16px',
		fontWeight: 400,
		lineHeight: 1.67,
		// margin: '20px',
		margin: 0,
		padding: '16px',
		textAlign: 'justify',
		width: '100%'
	},

	formControl: {
		marginRight: '100px'
	},

	divider: {
		backgroundColor: '#475768'
	},

	dividerWrapper: {
		width: '100%'
	},

	fullWidth: {
		width: '100%'
	},

	formGroup: {
		backgroundColor: 'transparent',
		'& span': {
			fontSize: '14px',
			lineHeight: '35px'
		},

		'& span strong': {
			fontSize: '16px'
		}
	},

	bullet: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '30px',
		height: '28px',
		borderRadius: '18px',
		backgroundColor: '#3b4b59',
		border: 'solid 1px #495b70'
	},

	description: {
		marginTop: '0px',
		textAlign: 'left',
		maxWidth: '620px'
	},

	buttonWrapper: {
		marginRight: '30px'
	},

	button: {
		color: '#93b0c1',
		border: '1px solid #3b4a5a',
		fontWeight: 400,
		'&:disabled': {
			color: '#48565f'
		}
	},

	buttonDescription: {
		fontSize: '12px',
		width: '100%'
	},

	requirementListItem: {
		columnBreakInside: 'avoid',
		color: '#93b0c1'
	},

	requirementList: {
		columnCount: 2
	},

	notEnteredRequeriment: {
		height: '28px',
		width: '30px',
		borderRadius: '18px',
		backgroundColor: '#F5A623'
	},

	bold: {
		fontWeight: 600
	},

	backButtonContainer: {
		left: '15px',
		position: 'absolute',
		top: '120px'
	},

	descriptionContainer: {
		width: '100%'
	},

	bottomSpace: {
		marginBottom: '20px'
	},

	exchange: {
		paddingTop: '3px'
	},
	strong: {
		fontWeight: '600'
	}
});

class MarketplaceServiceDetailsComponent extends Component {
	state = {
		isDescriptionTruncated: true
	};

	handleViewAllDetails() {
		this.setState({ isDescriptionTruncated: !this.state.isDescriptionTruncated });
	}

	renderDescription(description) {
		if (this.state.isDescriptionTruncated) {
			return <Truncate lines={5}>{description}</Truncate>;
		}

		return description;
	}

	render() {
		const { classes, item, backAction, relyingPartyName, templates } = this.props;

		return (
			<Grid container>
				<Grid item>
					<div className={classes.backButtonContainer}>
						<Button
							variant="outlined"
							color="secondary"
							size="small"
							onClick={backAction}
						>
							<Typography
								variant="subtitle2"
								color="secondary"
								className={classes.bold}
							>
								‹ Back
							</Typography>
						</Button>
					</div>
				</Grid>
				<Grid container className={classes.root}>
					<Grid
						container
						id="header"
						direction="row"
						justify="flex-start"
						alignItems="center"
						className={classes.header}
					>
						<Grid item id="icon" className={classes.icon}>
							<img src={item.logo[0].url} />
						</Grid>
						<Grid item id="title" className={classes.title}>
							<Grid container alignItems="center">
								<Typography variant="h1">{item.name}</Typography>
								<Typography variant="h1">&nbsp;</Typography>
								<Typography
									variant="subtitle2"
									color="secondary"
									className={classes.exchange}
								>
									- Exchange
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item id="body" className={classes.body}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							spacing={32}
						>
							<Grid
								item
								id="description"
								xs={12}
								className={classes.descriptionContainer}
							>
								<Grid
									container
									direction="row"
									justify="center"
									alignItems="flex-start"
									spacing={40}
								>
									<Grid item xs={8}>
										<Typography variant="body1" className={classes.bottomSpace}>
											{this.renderDescription(item.description)}
										</Typography>
										<Button
											variant="outlined"
											className={`${classes.button} ${
												classes.buttonDescription
											}`}
											onClick={() => this.handleViewAllDetails()}
										>
											{this.state.isDescriptionTruncated
												? 'VIEW ALL DETAILS'
												: 'COLLAPSE DETAILS'}
										</Button>
									</Grid>
									<Grid item xs={4} />
								</Grid>
							</Grid>
							<Grid item className={classes.dividerWrapper}>
								<Divider className={classes.divider} />
							</Grid>
							<Grid item id="highlights" className={classes.fullWidth}>
								<Grid
									container
									direction="column"
									justify="flex-start"
									alignItems="flex-start"
									spacing={16}
								>
									<Grid item>
										<Typography variant="h2">Exchange Highlights</Typography>
									</Grid>
									<Grid item>
										<FormControl className={classes.formControl}>
											<FormGroup className={classes.formGroup}>
												<span>
													<strong className={classes.strong}>
														Location:
													</strong>{' '}
													{item.location}{' '}
												</span>
												<span>
													<strong className={classes.strong}>
														Year Launched:
													</strong>{' '}
													{item.year_launched}{' '}
												</span>
												<span>
													<strong className={classes.strong}>
														Coin Pairs:
													</strong>{' '}
													{item.coin_pairs}{' '}
												</span>
												<span>
													<strong className={classes.strong}>
														Maker Fee:
													</strong>{' '}
													{item.maker_fee}{' '}
												</span>
												<span>
													<strong className={classes.strong}>
														Taker Fee:
													</strong>{' '}
													{item.taker_fee}{' '}
												</span>
												<span>
													<strong className={classes.strong}>URL:</strong>{' '}
													{item.url}{' '}
												</span>
											</FormGroup>
										</FormControl>
										<FormControl className={classes.formControl}>
											<FormGroup className={classes.formGroup}>
												<span>
													<strong className={classes.strong}>
														FIAT Payment:
													</strong>{' '}
													{item.fiat_payments}{' '}
												</span>
												<span>
													<strong className={classes.strong}>
														FIAT Supported:
													</strong>{' '}
													{item.fiat_supported
														? item.fiat_supported
																.toString()
																.replace(/,/g, ' ')
														: ''}{' '}
												</span>
												<span>
													<strong className={classes.strong}>
														Margin Trading:
													</strong>{' '}
													{item.margin_trading}{' '}
												</span>
												<span>
													<strong className={classes.strong}>
														KYC/AML:
													</strong>{' '}
													{item.kyc_aml}{' '}
												</span>
												<span>
													<strong className={classes.strong}>
														Excluded Resident:
													</strong>{' '}
													{item.excluded_residents}{' '}
												</span>
												<span>
													<strong className={classes.strong}>
														Contact:
													</strong>{' '}
													{item.email}{' '}
												</span>
											</FormGroup>
										</FormControl>
									</Grid>
								</Grid>
							</Grid>
							<Grid item id="requirements" className={classes.fullWidth}>
								<Grid
									container
									direction="column"
									justify="flex-start"
									alignItems="flex-start"
									spacing={16}
								>
									<Grid item style={{ width: '100%' }}>
										<KycRequirements
											relyingPartyName={relyingPartyName}
											templateId={templates[0]}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const MarketplaceServiceDetails = withStyles(styles)(MarketplaceServiceDetailsComponent);

export default MarketplaceServiceDetails;
