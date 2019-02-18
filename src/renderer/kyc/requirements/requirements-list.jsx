import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, List, ListItem, CircularProgress } from '@material-ui/core';
import { CheckedIcon } from 'selfkey-ui';

const styles = theme => ({
	kyc: {
		width: '100%',
		paddingTop: '40px',
		borderTop: '2px solid #475768',
		marginTop: '40px'
	},
	kycRequirements: {
		'& > div': {
			width: '30%'
		}
	}
});

const KycRequirementListItem = withStyles(styles)(({ requirement }) => (
	<ListItem>
		<CheckedIcon
			item={requirement.options && requirement.options.length ? 'verified' : 'unverified'}
		/>
		<Typography variant="body2" color="textSecondary" gutterBottom>
			{requirement.type ? requirement.type.content.title : requirement.schemaId}
		</Typography>
	</ListItem>
));

const KycRequirementsListComponent = props => {
	const {
		classes,
		requirements,
		title = 'KYC Requirements:',
		subtitle,
		cols = 2,
		loading
	} = props;

	if (loading) {
		return <CircularProgress />;
	}

	const requirementsPerCol = (requirements || []).reduce((acc, curr, indx) => {
		const col = indx % cols;
		if (!acc[col]) acc[col] = [];
		acc[col].push(curr);
		return acc;
	}, []);

	return (
		<div className={classes.kyc}>
			<Typography variant="h2" gutterBottom>
				{title}
			</Typography>
			{subtitle ? <Typography variant="body2">{subtitle}</Typography> : ''}
			<Grid container justify="left" alignItems="left" className={classes.kycRequirements}>
				{requirementsPerCol.map((col, ind) => (
					<Grid key={ind} item>
						<List>
							{col.map((item, ind) => (
								<KycRequirementListItem key={ind} requirement={item} />
							))}
						</List>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export const KycRequirementsList = withStyles(styles)(KycRequirementsListComponent);

export default KycRequirementsList;
