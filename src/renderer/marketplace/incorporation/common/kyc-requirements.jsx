import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, List, ListItem } from '@material-ui/core';
import { CheckedIcon } from 'selfkey-ui';

const styles = theme => ({
	kyc: {
		width: '100%',
		paddingTop: '40px',
		borderTop: '2px solid #475768',
		marginTop: '40px'
	},
	kycRequirements: {}
});

const IncorporationsKYCItem = ({ item }) => {
	console.log(item);
	const type = item.type && item.type.content ? item.type.content.title : item.schemaId;
	const warning = !item.options || !item.options.length;
	// const icon = warning ? <CheckEmptyIcon /> : <CheckedIcon item="verified" />;
	const icon = warning ? <CheckedIcon item="unverified" /> : <CheckedIcon item="verified" />;

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
			<Grid
				container
				justify="flex-start"
				alignItems="flex-start"
				direction="column"
				className={classes.kycRequirements}
			>
				<div>
					<List>
						{requirements.map(r => (
							<IncorporationsKYCItem key={r.id} item={r} />
						))}
					</List>
				</div>
			</Grid>
		</div>
	);
};

export default withStyles(styles)(IncorporationsKYC);
