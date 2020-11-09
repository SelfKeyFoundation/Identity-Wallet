import React from 'react';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { GreenTick, DeniedTick } from 'selfkey-ui';

const styles = theme => ({
	listContainer: {
		'& ul.list': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: theme.spacing(0),
			marginBottom: theme.spacing(3)
		},
		'& ul.list li': {
			lineHeight: '1.4em',
			marginBottom: theme.spacing(1),
			paddingLeft: theme.spacing(0)
		}
	},
	booleanProp: {
		'& h5': {
			fontWeight: 'normal',
			fontSize: '14px',
			margin: theme.spacing(0)
		}
	},
	textProp: {
		'& h5': {
			fontWeight: 'normal',
			display: 'inline-block',
			fontSize: '14px',
			margin: theme.spacing(0)
		},
		'& div': {
			display: 'inline-block'
		},
		'& h5.value': {
			color: '#93B0C1',
			marginLeft: theme.spacing(2),
			fontWeight: 'bold'
		}
	},
	denied: {
		'& rect': {
			fill: '#697C95 !important'
		}
	}
});

const BooleanProp = withStyles(styles)(({ prop, data, classes }) => (
	<ListItem key={prop.id} className={classes.booleanProp}>
		{data[prop.id] ? (
			<GreenTick />
		) : (
			<span className={classes.denied}>
				<DeniedTick />
			</span>
		)}
		<Typography variant="h5" gutterBottom>
			{prop.label}
		</Typography>
	</ListItem>
));

const TextProp = withStyles(styles)(({ prop, data, classes }) => (
	<React.Fragment>
		{data[prop.id] && (
			<ListItem key={prop.id} className={classes.textProp}>
				<Typography variant="h5" gutterBottom>
					{prop.label}
				</Typography>
				<Typography variant="h5" gutterBottom className="value">
					{data[prop.id]}
				</Typography>
			</ListItem>
		)}
	</React.Fragment>
));

const IncorporationsDataPanel = withStyles(styles)(({ classes, sections, data }) => (
	<Grid container justify="flex-start" alignItems="flex-start" className={classes.listContainer}>
		{sections.map((s, idx) => (
			<React.Fragment key={idx}>
				<List className="list">
					{s.map(prop => (
						<React.Fragment key={prop.id}>
							{prop.boolean ? (
								<BooleanProp prop={prop} data={data} />
							) : (
								<TextProp prop={prop} data={data} />
							)}
						</React.Fragment>
					))}
				</List>
			</React.Fragment>
		))}
	</Grid>
));

export { IncorporationsDataPanel };
export default IncorporationsDataPanel;
