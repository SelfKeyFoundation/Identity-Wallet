import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CorporateMembers } from '../common/corporate-members';

const styles = theme => ({});

const CorporateMembersTab = withStyles(styles)(props => (
	<Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={16}>
		<Grid item>
			<CorporateMembers {...props} />
		</Grid>
	</Grid>
));

export { CorporateMembersTab };
export default CorporateMembersTab;
