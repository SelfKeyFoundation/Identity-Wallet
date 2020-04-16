import React, { PureComponent } from 'react';
import { Typography, List, ListItem } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	tabContainer: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		padding: '30px 0 0',
		width: '100%'
	},
	gridPadding: {
		padding: '15px 0 !important'
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
	<div>
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
	</div>
));

class NotarizationKeyTabComponent extends PureComponent {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.tabContainer}>
				<div className={classes.gridPadding}>
					<Typography variant="h2">Key Information</Typography>
				</div>
				<KeyInformationList />
			</div>
		);
	}
}

export const NotarizationKeyTab = withStyles(styles)(NotarizationKeyTabComponent);

export default NotarizationKeyTab;
