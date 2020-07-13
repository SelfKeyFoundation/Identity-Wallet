import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, List, ListItem, CircularProgress } from '@material-ui/core';
import { CheckedIcon, StepIcon } from 'selfkey-ui';

const styles = theme => ({
	kyc: {
		width: '100%',
		paddingTop: '40px',
		borderTop: '2px solid #475768'
	},
	list: {
		columns: 2,
		width: '100%'
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

const KycRequirementListItem = withStyles(styles)(({ requirement, classes, index }) => {
	const type = requirement.title
		? requirement.title
		: requirement.type && requirement.type.content
		? requirement.type.content.title
		: requirement.schemaId;

	const warning = !requirement.options || !requirement.options.length;
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

const KycRequirementsListComponent = props => {
	const { classes, requirements, title = 'KYC Requirements:', subtitle, loading } = props;

	return (
		<div className={classes.kyc}>
			<Typography variant="h2" gutterBottom>
				KYC checklist for {title}
			</Typography>
			{subtitle ? <Typography variant="body2">{subtitle}</Typography> : ''}
			{loading && (
				<Grid container justify="center" alignItems="center" direction="column">
					<CircularProgress size={50} />
				</Grid>
			)}
			{!loading && (
				<Grid container justify="flex-start" alignItems="flex-start" direction="column">
					<List className={classes.list}>
						{requirements &&
							requirements.map((item, index) => (
								<KycRequirementListItem
									key={item.id}
									requirement={item}
									index={index}
								/>
							))}
					</List>
				</Grid>
			)}
		</div>
	);
};

export const KycRequirementsList = withStyles(styles)(KycRequirementsListComponent);

export default KycRequirementsList;
