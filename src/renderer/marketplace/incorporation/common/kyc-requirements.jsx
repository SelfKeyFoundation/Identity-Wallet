import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, List, ListItem } from '@material-ui/core';
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
	}
});

const IncorporationsKYCItem = ({ item, index }) => {
	const type = item.type && item.type.content ? item.type.content.title : item.schemaId;
	const warning = !item.options || !item.options.length;
	const icon = warning ? <StepIcon step={index + 1} /> : <CheckedIcon item="verified" />;

	return (
		<ListItem>
			{icon}
			<Typography variant="body2" color="textSecondary" gutterBottom>
				{type}
			</Typography>
		</ListItem>
	);
};

const IncorporationsKYC = props => {
	const { classes, requirements } = props;

	// Requirements might take a while to load
	if (!requirements) return null;

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
