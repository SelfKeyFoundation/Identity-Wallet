import React from 'react';
import { withStyles, Typography, Grid } from '@material-ui/core';
import classNames from 'classnames';
import { primary } from 'selfkey-ui';
const styles = theme => ({
	resumeTable: {},
	resumeEntry: {
		padding: '10px 15px',
		'& label': {
			fontSize: '13px',
			color: '#93B0C1'
		},
		'& h4': {
			marginTop: '0.25em',
			minHeight: '30px'
		}
	},
	resumeBox: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		background: '#2A3540'
	},
	gridWithBorder: {
		borderLeft: `2px solid ${primary}`
	},
	normalText: {
		color: '#fff'
	},
	highlitedText: {
		color: primary
	}
});

export const ResumeTableEntry = withStyles(styles)(({ classes, name, value = [], highlited }) => {
	if (!Array.isArray(value)) {
		value = [value];
	}
	return (
		<div className={classes.resumeEntry}>
			<label>{name}</label>
			{value.map((v, idx) => (
				<Typography
					key={idx}
					variant="h4"
					color="secondary"
					className={highlited ? classes.highlitedText : classes.normalText}
					gutterBottom
				>
					{v || '--'}
				</Typography>
			))}
		</div>
	);
});

export const ResumeTable = withStyles(styles)(({ classes, items = [] }) => (
	<div className={classes.resumeTable}>
		{items.map((item, idx) => (
			<ResumeTableEntry {...item} key={idx} />
		))}
	</div>
));

export const ResumeBox = withStyles(styles)(({ classes, className, itemSets = [] }) => (
	<Grid
		container
		direction="row"
		justify="flex-start"
		alignItems="stretch"
		className={classNames(classes.resumeBox, className)}
	>
		{itemSets.map((set, idx) => (
			<Grid item key={idx} className={idx ? classes.gridWithBorder : null}>
				<ResumeTable items={set} />
			</Grid>
		))}
	</Grid>
));
