import React from 'react';
import {
	withStyles,
	Typography,
	CardHeader,
	CardContent,
	List,
	Divider,
	Card,
	ListItem
} from '@material-ui/core';

const styles = theme => ({
	bold: {
		fontWeight: 600
	},
	listItem: {
		alignItems: 'baseline',
		display: 'flex',
		paddingLeft: 0,
		paddingRight: 0
	},
	listItemText: {
		minWidth: '37%',
		width: '37%'
	},
	padding: {
		marginBottom: '0 !important',
		marginLeft: '0 !important',
		paddingLeft: 0,
		paddingRight: 0
	}
});

export const AttributesTable = withStyles(styles)(({ classes, title, attributes = [] }) => (
	<Card>
		<CardHeader title={title} />
		<Divider />
		<CardContent className={classes.sanyi}>
			<List className={classes.padding}>
				{attributes.map((attr, idx) => (
					<ListItem className={classes.listItem} key={idx}>
						<Typography
							variant="body2"
							color="secondary"
							gutterBottom
							className={classes.listItemText}
						>
							{attr.name}
						</Typography>
						<Typography variant="body2" gutterBottom className={classes.bold}>
							{attr.value || '--'}
						</Typography>
					</ListItem>
				))}
			</List>
		</CardContent>
	</Card>
));

export default AttributesTable;
