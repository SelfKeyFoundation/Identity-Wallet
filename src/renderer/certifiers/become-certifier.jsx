import React, { Component } from 'react';
import { Grid, Typography, Button, Divider, withStyles, IconButton } from '@material-ui/core';
import { CloseButtonIcon, KeyTooltip, TooltipArrow, InfoTooltip } from 'selfkey-ui';

const styles = theme => ({
	container: {
		margin: '0 auto',
		maxWidth: '960px',
		position: 'relative',
		width: '100%'
	},
	containerHeader: {
		background: '#2A3540',
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
		marginBottom: 35
	},
	serviceCostBox: {
		marginBottom: '20px'
	}
});

const serviceCostStyle = theme => ({
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
	bold: {
		fontWeight: 600
	},
	rowSeparator: {
		border: '1px solid #475768',
		margin: '30px 0'
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
	<div className={classes.serviceCost}>
		<Typography variant="h2">Service Costs</Typography>
		<div className={classes.priceTable}>
			<div className={classes.priceRow}>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="center"
					spacing={0}
				>
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
				</Grid>
			</div>
		</div>
	</div>
));

export const StepItem = withStyles(stepItemStyle)(
	({ classes, number, title, description, link }) => {
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
						{description} {link ? <a className={classes.link}>{link}</a> : ''}
					</Typography>
				</div>
			</div>
		);
	}
);

class BecomeCertifierComponent extends Component {
	render() {
		const { classes, onBackClick } = this.props;

		return (
			<div className={classes.container}>
				<CloseButtonIcon onClick={onBackClick} className={classes.closeIcon} />
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.containerHeader}
				>
					<Typography variant="h2" className="region">
						Become a Certifier
					</Typography>
				</Grid>
				<div className={classes.contentContainer}>
					<Grid container className={classes.whyText}>
						<Grid item>
							<Typography variant="h2" gutterBottom>
								Why you get
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body2">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id
								nulla purus. Pellentesque nisl metus, finibus a lectus quis, tempus
								hendrerit lectus. Praesent nunc magna, porttitor id justo non,
								vulputate laoreet massa. Aenean commodo in justo vel consectetur.
								Curabitur finibus sem vitae urna cursus condimentum. Fusce enim
								arcu, pharetra in ornare a, congue vitae nibh. Cras tincidunt diam
								quis sem ultrices pulvinar. Maecenas sed velit tincidunt, egestas
								magna ac, commodo ante. Duis molestie libero vitae lorem volutpat, a
								tempor erat fringilla. <br />
								<br />
								Nam eu consequat diam. In hac habitasse platea dictumst. Vivamus
								lacinia, erat non lobortis vestibulum, ligula enim hendrerit lectus,
								non maximus mi ex ac dolor. Curabitur sit amet gravida augue. In
								vitae felis bibendum, feugiat mi a, condimentum tellus. Cras
								porttitor laoreet mauris eget fermentum. Nunc pellentesque non quam
								eu fermentum. Mauris nec metus non massa viverra vestibulum eu vel
								arcu. Vestibulum ante ipsum primis in faucibus orci luctus et
								ultrices posuere cubilia Curae.
							</Typography>
						</Grid>
					</Grid>
					<Divider className={classes.divider} />
					<Typography variant="h2" gutterBottom>
						How the process works
					</Typography>
					<Grid item>
						<Grid
							container
							direction="row"
							justify="space-between"
							alignItems="center"
							spacing={0}
						>
							<StepItem
								number={1}
								title="Join the maketplace"
								description="Joining our marketplace is FREE, you are paying only once for the Network Transaction Fee "
								link="(what’s this?)."
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
						</Grid>
					</Grid>

					<Divider className={classes.divider} />

					<Grid item className={classes.serviceCostBox}>
						<SimpleServiceCost />
					</Grid>

					<Grid item>
						<Grid container direction="row" spacing={24}>
							<Grid item>
								<Button
									variant="contained"
									size="large"
									onClick={this.onStartClick}
								>
									Apply as a Certifier
								</Button>
							</Grid>
							<Grid item>
								<Button variant="outlined" size="large" onClick={onBackClick}>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</div>
		);
	}
}

const BecomeCertifier = withStyles(styles)(BecomeCertifierComponent);
export default BecomeCertifier;
export { BecomeCertifier };
