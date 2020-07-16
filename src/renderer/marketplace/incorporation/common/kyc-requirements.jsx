import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, List, ListItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CheckedIcon, StepIcon } from 'selfkey-ui';

const styles = theme => ({
	kyc: {
		width: '100%',
		paddingTop: '40px',
		borderTop: '2px solid #475768',
		marginTop: '40px'
	},
	list: {
		columns: 2,
		width: '100%'
	},
	checkedStyle: {
		height: '44px',
		marginRight: '13px',
		marginTop: '-10px',
		paddingTop: '17px',
		width: '30px'
	},
	listItem: {
		breakInside: 'avoid',
		pageBreakInside: 'avoid',
		'& p': {
			fontWeight: 'bold'
		}
	},
	documentType: {
		display: 'flex',
		marginTop: '-14px'
	},
	documentIcon: {
		marginLeft: '10px'
	}
});

const IncorporationsKYCItem = withStyles(styles)(({ classes, item, index }) => {
	const type = item.title
		? item.title
		: item.type && item.type.content
		? item.type.content.title
		: item.schemaId;
	const warning = !item.options || !item.options.length;
	const icon = warning ? <StepIcon step={index + 1} /> : <CheckedIcon item="verified" />;

	return (
		<ListItem className={classes.listItem}>
			{icon}
			<Typography variant="body2" color="textSecondary" className={classes.documentType}>
				{type}
			</Typography>
		</ListItem>
	);
});

const IncorporationsKYC = props => {
	const { classes, requirements, templateId } = props;

	// No kyc-chain templateId is associated with this program
	// Hide the kyc requirements block
	if (!templateId) {
		return null;
	}

	// Requirements might take a while to load
	if (!requirements) {
		return (
			<div className={classes.kyc}>
				<Typography variant="h2" gutterBottom>
					KYC Requirements and Forms
				</Typography>
				<Grid container justify="center" alignItems="center">
					<CircularProgress size={50} />
				</Grid>
			</div>
		);
	}

	return (
		<div className={classes.kyc}>
			<Typography variant="h2" gutterBottom>
				KYC Requirements and Forms
			</Typography>
			<Grid container justify="flex-start" alignItems="flex-start" direction="column">
				<List className={classes.list}>
					{requirements.map((r, index) => (
						<IncorporationsKYCItem key={r.id} item={r} index={index} />
					))}
				</List>
			</Grid>
		</div>
	);
};

export default withStyles(styles)(IncorporationsKYC);
