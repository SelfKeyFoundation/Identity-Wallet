import React, { Component } from 'react';
import { withStyles, Typography, Grid, List, ListItem } from '@material-ui/core';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: '30px 0 0',
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '0em'
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: '1.5em',
			marginBottom: '1.5em'
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: '19px'
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	},
	gridPadding: {
		padding: '15px 20px !important'
	}
});

const listItemStyles = theme => ({
	list: {
		paddingLeft: 0,
		paddingRight: 0
	},
	listItem: {
		alignItems: 'baseline',
		padding: 0
	},
	label: {
		width: '200px'
	}
});

export const KeyInformationListItem = withStyles(listItemStyles)(({ classes, label, data }) => (
	<ListItem key={label} className={classes.listItem}>
		<Typography variant="body2" color="secondary" className={classes.label}>
			{label}
		</Typography>
		<Typography variant="body2">{data}</Typography>
	</ListItem>
));

export const KeyInformationList = withStyles(listItemStyles)(({ classes }) => (
	<Grid>
		<List className={classes.list}>
			<KeyInformationListItem
				label="Services Provided:"
				data="Notarization, Identity Verification"
			/>
			<KeyInformationListItem label="Available For:" data="US, Canada, Europe" />
			<KeyInformationListItem label="ID Verification Required:" data="Yes" />
			<KeyInformationListItem label="Video Call Required:" data="Yes" />
			<KeyInformationListItem label="Standard Notarized Document Price:" data="$ 25 USD" />
		</List>
	</Grid>
));

class NotarizationKeyTabComponent extends Component {
	state = { option: null };
	toggleOption = optionIdx => expanded => {
		const { option } = this.state;
		if (!expanded) {
			return this.setState({ option: null });
		}
		if (option !== optionIdx) {
			return this.setState({ option: optionIdx });
		}
	};
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.tabContainer}>
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems="stretch"
					spacing={40}
				>
					<Grid item className={classes.gridPadding}>
						<Typography variant="h2">Key Informations</Typography>
					</Grid>
					<KeyInformationList />
				</Grid>
			</div>
		);
	}
}

export const NotarizationKeyTab = withStyles(styles)(NotarizationKeyTabComponent);

export default NotarizationKeyTab;
