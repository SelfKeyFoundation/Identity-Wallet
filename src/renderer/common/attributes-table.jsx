import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import { base } from 'selfkey-ui';

const styles = theme => ({
	attributeTableContainer: {
		width: '100%',
		height: '100%',
		border: '1px solid #303C49',
		backgroundColor: base,
		borderRadius: '4px'
	},
	attributesTable: {
		width: '100%',
		textAlign: 'left',
		'& th, & td': {
			padding: '15px'
		}
	},
	nameCol: {
		maxWidth: '200px',
		width: '200px'
	},
	thead: {
		borderBottom: '1px solid #303C49'
	},
	value: {
		fontWeight: 700
	}
});

export const AttributesTable = withStyles(styles)(({ classes, title, attributes = [] }) => (
	<div className={classes.attributeTableContainer}>
		<table className={classes.attributesTable}>
			<thead className={classes.thead}>
				<th colSpan="2">
					<Typography variant="h2">{title}</Typography>
				</th>
			</thead>
			<tbody>
				{attributes.map((attr, idx) => (
					<tr key={idx}>
						<td className={classes.nameCol}>
							<Typography variant="subtitle2" color="secondary">
								{attr.name}
							</Typography>
						</td>
						<td>
							<Typography variant="subtitle2" className={classes.value}>
								{attr.value || '--'}
							</Typography>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
));

export default AttributesTable;
