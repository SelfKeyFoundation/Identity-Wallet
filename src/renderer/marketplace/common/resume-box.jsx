import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';
import classNames from 'classnames';
import { primary } from 'selfkey-ui';
const styles = theme => ({
	resumeTable: {},
	topPadding: {
		padding: '10px 15px'
	},
	bottomPadding: {
		padding: '10px 15px 15px'
	},
	resumeEntry: {
		maxWidth: '200px',
		'& h4': {
			fontSize: '20px',
			lineHeight: '24px'
		}
	},
	resumeBox: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		background: '#2A3540'
	},
	gridWithBorder: {
		borderImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.12) 3%, ${primary} 100%)`,
		borderImageSlice: 1,
		borderLeft: `1px solid ${primary}`
	},
	normalText: {
		color: '#fff'
	},
	highlightedText: {
		color: primary
	},
	resumeBoxItem: {
		width: '150px'
	}
});

export const ResumeTableEntry = withStyles(styles)(({ classes, name, idx, value = [] }) => {
	if (!Array.isArray(value)) {
		value = [value];
	}
	const itemClassName = idx === 0 ? classes.topPadding : classes.bottomPadding;
	return (
		<div className={`${classes.resumeEntry} ${itemClassName}`}>
			<Typography variant="subtitle2" color="secondary">
				{name}
			</Typography>
			{value.map((v, idx) => (
				<Typography
					key={idx}
					variant="h4"
					className={v === '0%' ? classes.normalText : classes.highlightedText}
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
			<ResumeTableEntry {...item} key={idx} idx={idx} />
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
			<Grid
				item
				key={idx}
				className={`${classes.resumeBoxItem} ${idx ? classes.gridWithBorder : null}`}
			>
				<ResumeTable items={set} />
			</Grid>
		))}
	</Grid>
));
