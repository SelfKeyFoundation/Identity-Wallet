import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import {
	Grid,
	Divider,
	FormGroup,
	FormControl,
	Button,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar
} from '@material-ui/core';
import {
	H2,
	H3,
	P,
	TickIcon,
	UnlockIcon,
	ReturnIcon,
	HourGlassSmallIcon,
	CalendarIcon,
	DocumentIcon,
	StyledButton
} from 'selfkey-ui';
import Truncate from 'react-truncate';

const styles = theme => ({
	root: {
		width: '946px',
		height: '100%',
		marginTop: '50px',
		marginBottom: '30px',
		border: 'solid 1px #303c49',
		borderRadius: '4px'
	},

	title: {
		margin: '20px'
	},

	icon: {
		marginLeft: '20px'
	},

	header: {
		backgroundColor: '#2a3540'
	},

	body: {
		textAlign: 'justify',
		margin: '20px',
		color: '#fff',
		fontFamily: 'Lato, arial, sans-serif',
		fontSize: '16px',
		fontWeight: 400,
		lineHeight: 1.67
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

	formGroup: {
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
		borderColor: '#3b4a5a',
		'&:disabled': {
			color: '#48565f'
		}
	},

	buttonDescription: {
		fontSize: '12px',
		width: '620px'
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

	unlockButtonText: {
		display: 'flex',
		flexFlow: 'column',
		minWidth: '180px',
		textAlign: 'center'
	},

	daysLeft: {
		color: '#93B0C1',
		fontSize: '13px'
	}
});

class ItemDetailsComponent extends Component {
	state = {
		isDescriptionTruncated: true
	};

	getKYCRequirements(requirements, classes) {
		return requirements.map((requirement, index) => {
			return (
				<ListItem key={requirement.name} className={classes.requirementListItem}>
					<ListItemAvatar>
						{requirement.isEntered ? (
							<Avatar className={classes.bullet}>
								<TickIcon />
							</Avatar>
						) : (
							<Avatar className={classes.notEnteredRequeriment}>
								<div>{index + 1}</div>
							</Avatar>
						)}
					</ListItemAvatar>
					<ListItemText disableTypography={true}>{requirement.name}</ListItemText>
					{requirement.type === 'document' && <DocumentIcon />}
				</ListItem>
			);
		});
	}

	unlockActionCall(unlockAction, item, hasBalance) {
		if (!unlockAction) {
			return;
		}
		unlockAction(hasBalance);
	}

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
		const { classes, item, unlockAction, hasBalance, backAction } = this.props;
		let daysLeft = 0;
		if (item.status === 'locked' && item.releaseDate) {
			daysLeft = Math.ceil((item.releaseDate - Date.now()) / 1000 / 60 / 60 / 24);
		}
		return (
			<Grid container>
				<Grid item className={classes.buttonWrapper}>
					<Button variant="outlined" className={classes.button} onClick={backAction}>
						&#60; Back
					</Button>
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
							<H2>{item.name}</H2>
						</Grid>
					</Grid>
					<Grid item id="body" className={classes.body} xs={12}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							spacing={32}
							xs={12}
						>
							<Grid item id="description" xs={12}>
								<Grid
									container
									direction="row"
									justify="center"
									alignItems="flex-start"
									spacing={40}
								>
									<Grid item xs={8}>
										<P className={classes.description}>
											{this.renderDescription(item.description)}
										</P>
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
									<Grid item xs={4}>
										<StyledButton
											disabled={['pending', 'Inactive'].includes(item.status)}
											variant={
												['unlocked', 'locked'].includes(item.status)
													? 'outlined'
													: 'contained'
											}
											onClick={() =>
												this.unlockActionCall(
													unlockAction,
													item,
													hasBalance
												)
											}
										>
											{item.status === 'Active' && <UnlockIcon />}
											{item.status === 'pending' && (
												<HourGlassSmallIcon
													width="10px"
													height="14px"
													fill="rgba(0, 0, 0, 0.26)"
												/>
											)}
											{item.status === 'locked' && <CalendarIcon />}
											{item.status === 'unlocked' && <ReturnIcon />}
											<div className={classes.unlockButtonText}>
												<span>{item.integration}</span>
												{item.status === 'locked' && daysLeft && (
													<span className={classes.daysLeft}>
														{daysLeft} days left
													</span>
												)}
											</div>
										</StyledButton>
									</Grid>
								</Grid>
							</Grid>
							<Grid item className={classes.dividerWrapper}>
								<Divider className={classes.divider} />
							</Grid>
							<Grid item id="highlights">
								<Grid
									container
									direction="column"
									justify="flex-start"
									alignItems="flex-start"
									spacing={16}
								>
									<Grid item>
										<H3>Highlights</H3>
									</Grid>
									<Grid item>
										<FormControl className={classes.formControl}>
											<FormGroup className={classes.formGroup}>
												<span>
													<strong>Location:</strong> {item.location}{' '}
												</span>
												<span>
													<strong>Year Launched:</strong>{' '}
													{item.year_launched}{' '}
												</span>
												<span>
													<strong>Coin Pairs:</strong> {item.coin_pairs}{' '}
												</span>
												<span>
													<strong>Maker Fee:</strong> {item.maker_fee}{' '}
												</span>
												<span>
													<strong>Taker Fee:</strong> {item.taker_fee}{' '}
												</span>
												<span>
													<strong>URL:</strong> {item.url}{' '}
												</span>
											</FormGroup>
										</FormControl>
										<FormControl className={classes.formControl}>
											<FormGroup className={classes.formGroup}>
												<span>
													<strong>FIAT Payment:</strong>{' '}
													{item.fiat_payments}{' '}
												</span>
												<span>
													<strong>FIAT Supported:</strong>{' '}
													{item.fiat_supported
														? item.fiat_supported
																.toString()
																.replace(/,/g, ' ')
														: ''}{' '}
												</span>
												<span>
													<strong>Margin Trading:</strong>{' '}
													{item.margin_trading}{' '}
												</span>
												<span>
													<strong>KYC/AML:</strong> {item.kyc_aml}{' '}
												</span>
												<span>
													<strong>Excluded Resident:</strong>{' '}
													{item.excluded_residents}{' '}
												</span>
												<span>
													<strong>Contact:</strong> {item.email}{' '}
												</span>
											</FormGroup>
										</FormControl>
									</Grid>
								</Grid>
							</Grid>
							<Grid item className={classes.dividerWrapper}>
								<Divider className={classes.divider} />
							</Grid>
							<Grid item id="requirements">
								<Grid
									container
									direction="column"
									justify="flex-start"
									alignItems="flex-start"
									spacing={16}
								>
									<Grid item>
										<H3>KYC Requirements</H3>
									</Grid>
									<Grid item>
										<List className={classes.requirementList}>
											{this.getKYCRequirements(item.kyc_template, classes)}
										</List>
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

const ItemDetails = withStyles(styles)(ItemDetailsComponent);

export { ItemDetails };

export default ItemDetails;
