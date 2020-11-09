import React from 'react';
import { Grid, CardHeader, CardContent, List, Divider, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { typography } from 'selfkey-ui';

const styles = theme => ({
	bold: {
		fontWeight: 600
	},
	padding: {
		marginBottom: `${theme.spacing(0)} !important`,
		marginLeft: `${theme.spacing(0)} !important`,
		paddingLeft: theme.spacing(0),
		paddingRight: theme.spacing(0)
	},
	divider: {
		margin: theme.spacing(0, 2)
	},
	listContainer: {
		marginBottom: theme.spacing(3)
	},
	term: {
		color: typography,
		fontSize: '16px',
		lineHeight: '20px',
		minWidth: '37%',
		width: '37%'
	},
	describe: {
		fontSize: '16px',
		lineHeight: '20px',
		minWidth: '63%',
		paddingLeft: theme.spacing(1),
		width: 'calc(63% - 10px)'
	}
});

export const AttributesTable = withStyles(styles)(({ classes, title, attributes = [] }) => (
	<Card>
		<CardHeader title={title} />
		<Divider className={classes.divider} />
		<CardContent>
			<List component="dl" className={classes.padding}>
				{attributes.map((attr, idx) => (
					<Grid container className={classes.listContainer} wrap="nowrap" key={idx}>
						<dt className={classes.term}>{attr.name}</dt>
						<dd className={`${classes.describe} ${classes.bold}`}>
							{attr.value || '--'}
						</dd>
					</Grid>
				))}
			</List>
		</CardContent>
	</Card>
));

export default AttributesTable;
