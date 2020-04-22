import React from 'react';
import { Typography, Button, Divider, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CloseButtonIcon, KeyTooltip, TooltipArrow, InfoTooltip } from 'selfkey-ui';

const styles = theme => ({
	container: {
		margin: '0 auto',
		maxWidth: '960px',
		position: 'relative',
		width: '100%'
	},
	containerHeader: {
		alignItems: 'flex-start',
		background: '#2A3540',
		display: 'flex',
		justify: 'flex-start',
		padding: '25px 30px',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-20px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	},
	divider: {
		height: '2px',
		marginBottom: '20px'
	},
	whyText: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: 35
	},
	steps: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between'
	},
	applyBtn: {
		marginRight: '20px'
	}
});

const serviceCostStyle = theme => ({
	serviceCostBox: {
		marginBottom: '20px'
	},
	serviceCost: {
		paddingBottom: '30px',
		width: '100%'
	},
	priceTable: {
		background: '#313D49',
		margin: '20px 0 0',
		padding: '20px'
	},
	priceRow: {
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
	priceRowBox: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'flex-start'
	},
	bold: {
		fontWeight: 600
	}
});

const stepItemStyle = theme => ({
	howItWorksBox: {
		background: '#313D49',
		borderRadius: '4px',
		boxSizing: 'border-box',
		color: '#FFF',
		height: '178px',
		margin: '0 0 2em 0',
		minHeight: '178px',
		padding: '2em 3%',
		width: '32%',
		'& header': {
			display: 'flex'
		},
		'& header h4': {
			display: 'inline-block',
			fontSize: '16px',
			fontWeight: 500,
			marginLeft: '0.5em',
			marginTop: '-3px'
		},
		'& header span': {
			color: '#00C0D9',
			fontSize: '20px',
			fontWeight: 'bold'
		}
	},
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	}
});

export const SimpleServiceCost = withStyles(serviceCostStyle)(({ classes }) => (
	<div className={classes.serviceCostBox}>
		<div className={classes.serviceCost}>
			<Typography variant="h2">Service Costs</Typography>
			<div className={classes.priceTable}>
				<div className={classes.priceRow}>
					<div className={classes.priceRowBox}>
						<div className="rowItem">
							<Typography variant="body2" color="secondary">
								Network Transaction Fee
							</Typography>
						</div>
						<div className="rowItem time" />
						<div className="rowItem price">
							<Typography className={classes.bold} variant="body2" color="primary">
								$0,01
							</Typography>
							<Typography variant="subtitle2" color="secondary">
								0,3237484 ETH
								<KeyTooltip
									interactive
									placement="top-start"
									title={
										<React.Fragment>
											<span>...</span>
											<TooltipArrow />
										</React.Fragment>
									}
								>
									<IconButton aria-label="Info">
										<InfoTooltip />
									</IconButton>
								</KeyTooltip>
							</Typography>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
));

export const StepItem = withStyles(stepItemStyle)(
	({ classes, number, onWhatsThisClicked, title, description }) => {
		return (
			<div className={classes.howItWorksBox}>
				<header className={classes.header}>
					<span>{number}</span>
					<Typography variant="h4" gutterBottom>
						{title}
					</Typography>
				</header>
				<div>
					<Typography variant="subtitle2" color="secondary">
						{description}{' '}
						{onWhatsThisClicked && (
							<a className={classes.link} onClick={onWhatsThisClicked}>
								(what’s this?)
							</a>
						)}
						.
					</Typography>
				</div>
			</div>
		);
	}
);

export const BecomeCertifierPage = withStyles(styles)(props => {
	const { classes, onBackClick, handleWhatsThisClicked, onStartClick } = props;

	return (
		<div className={classes.container}>
			<CloseButtonIcon onClick={onBackClick} className={classes.closeIcon} />
			<div className={classes.containerHeader}>
				<Typography variant="h2" className="region">
					Become a Certifier
				</Typography>
			</div>
			<div className={classes.contentContainer}>
				<div className={classes.whyText}>
					<Typography variant="h2" gutterBottom>
						Why you get
					</Typography>
					<Typography variant="body2">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id nulla
						purus. Pellentesque nisl metus, finibus a lectus quis, tempus hendrerit
						lectus. Praesent nunc magna, porttitor id justo non, vulputate laoreet
						massa. Aenean commodo in justo vel consectetur. Curabitur finibus sem vitae
						urna cursus condimentum. Fusce enim arcu, pharetra in ornare a, congue vitae
						nibh. Cras tincidunt diam quis sem ultrices pulvinar. Maecenas sed velit
						tincidunt, egestas magna ac, commodo ante. Duis molestie libero vitae lorem
						volutpat, a tempor erat fringilla. <br />
						<br />
						Nam eu consequat diam. In hac habitasse platea dictumst. Vivamus lacinia,
						erat non lobortis vestibulum, ligula enim hendrerit lectus, non maximus mi
						ex ac dolor. Curabitur sit amet gravida augue. In vitae felis bibendum,
						feugiat mi a, condimentum tellus. Cras porttitor laoreet mauris eget
						fermentum. Nunc pellentesque non quam eu fermentum. Mauris nec metus non
						massa viverra vestibulum eu vel arcu. Vestibulum ante ipsum primis in
						faucibus orci luctus et ultrices posuere cubilia Curae.
					</Typography>
				</div>
				<Divider className={classes.divider} />
				<Typography variant="h2" gutterBottom>
					How the process works
				</Typography>
				<div className={classes.steps}>
					<StepItem
						number={1}
						title="Join the maketplace"
						description="Joining our marketplace is FREE, you are paying only once for the Network Transaction Fee "
						onWhatsThisClicked={handleWhatsThisClicked}
					/>
					<StepItem
						number={2}
						title="Pick the certifications requests you want"
						description="You get to see all the certifications requests from our users, and you can pick to work on whatever you wish."
					/>
					<StepItem
						number={3}
						title="Earn Money"
						description="For each certification process you complete you earn money, as KEY tokens. You can swap the token for any currency you need."
					/>
				</div>

				<Divider className={classes.divider} />

				<SimpleServiceCost />

				<div>
					<Button
						className={classes.applyBtn}
						variant="contained"
						size="large"
						onClick={onStartClick}
					>
						Apply as a Certifier
					</Button>
					<Button variant="outlined" size="large" onClick={onBackClick}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
});

export default BecomeCertifierPage;
