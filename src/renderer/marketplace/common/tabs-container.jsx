import React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';

const styles = theme => ({
	tabsRoot: {
		borderBottom: '1px solid #697C95',
		width: '100%'
	},
	tabsIndicator: {
		backgroundColor: '#00C0D9'
	},
	tabRoot: {
		color: '#FFFFFF',
		textAlign: 'center',
		padding: '0',
		minWidth: '140px'
	},
	tabLabelContainer: {
		padding: '0',
		textTransform: 'Capitalize'
	},
	tabWrapper: {
		padding: '0',
		textTransform: 'Capitalize'
	},
	tabLabel: {
		color: '#FFFFFF'
	},
	tabContainer: {
		width: '100%',
		padding: '2em 0',
		color: '#FFFFFF',
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em'
		},
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
			marginBottom: '0.5em'
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	},
	tabDescription: {
		marginTop: '40px'
	}
});

function TabContainer({ children }) {
	return <div>{children}</div>;
}

/**
 * Web implementation for tab controller
 *
 */
const TabsContainer = withStyles(styles)(({ classes, tab, onTabChange, tabs, ...tabProps }) => {
	const selectedTab = tabs.find(t => t.id === tab) || tabs[0];

	return (
		<React.Fragment>
			<Tabs value={tab} onChange={(evt, value) => onTabChange(value)}>
				{tabs.map(tab => (
					<Tab
						key={tab.id}
						value={tab.id}
						label={tab.label}
						disabled={tab.disabled && tab.disabled(tabProps)}
						className={classes.tabRoot}
					/>
				))}
			</Tabs>
			<div className={classes.tabContainer} onClickCapture={tabProps.handleExternalLinks}>
				<TabContainer className={selectedTab.className}>
					<selectedTab.component {...tabProps} classes={classes} />
				</TabContainer>
			</div>
		</React.Fragment>
	);
});

export default TabsContainer;
