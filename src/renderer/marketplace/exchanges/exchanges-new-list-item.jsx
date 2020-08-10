import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Tag, DropdownIcon } from 'selfkey-ui';

const styles = theme => ({
	item: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		marginBottom: '30px',
		width: '31.5%'
	},
	header: {
		alignItems: 'center',
		backgroundColor: '#2A3540',
		borderBottom: '1px solid #303C49',
		borderRadius: '4px 4px 0 0',
		boxSizing: 'border-box',
		display: 'flex',
		flexWrap: 'nowrap',
		justifyContent: 'space-between',
		padding: '15px'
	},
	body: {
		padding: '15px'
	},
	icon: {
		marginRight: '10px'
	},
	iconAndName: {
		alignItems: 'center',
		display: 'flex',
		flexWrap: 'nowrap'
	},
	dropdownIcon: {
		cursor: 'pointer',
		transform: 'rotate(-90deg)'
	},
	defaultIcon: {
		alignItems: 'center',
		borderRadius: '5px',
		display: 'flex',
		justifyContent: 'center',
		maxWidth: '30px'
	},
	generatedIcon: {
		height: '30px'
	},
	excluded: {
		padding: '10px 10px 10px 0',
		whiteSpace: 'normal',
		width: '100px',
		wordBreak: 'break-word'
	},
	rightSpace: {
		marginRight: '3px'
	}
});

export const ExchangesNewListItem = withStyles(styles)(
	({
		id,
		classes,
		children,
		name,
		location,
		fees,
		fiatSupported,
		fiatPayments,
		excludedResidents,
		allFeesEmpty,
		logoUrl,
		status,
		viewAction
	}) => {
		const getColors = () => ['#46dfba', '#46b7df', '#238db4', '#25a788', '#0e4b61'];
		let random = Math.floor(Math.random() * 4);

		const icon = logoUrl ? (
			<img src={logoUrl} className={classes.defaultIcon} />
		) : (
			<div
				className={`${classes.defaultIcon} ${classes.generatedIcon}`}
				style={{
					backgroundColor: getColors()[random]
				}}
			>
				{name.charAt(0)}
			</div>
		);

		const isFiatSupported =
			fiatSupported !== '-' &&
			fiatSupported.length !== 0 &&
			fiatSupported[0] !== 'Not Available';

		const isFiatPayments =
			fiatPayments !== '-' &&
			fiatPayments.length !== 0 &&
			fiatPayments[0] !== 'Not Available';

		const supportedFiats = fiatSupported => {
			return (
				<React.Fragment>
					{fiatSupported.map((fiat, index) => (
						<Tag key={index}>{fiat}</Tag>
					))}
				</React.Fragment>
			);
		};

		const fourOrMoreFiats = fiatSupported => {
			const restOfFiats = fiatSupported.length - 3;
			const firstThreeFiats = fiatSupported.slice(0, 3);
			return (
				<React.Fragment>
					{supportedFiats(firstThreeFiats)}
					<Tag>+{restOfFiats} more</Tag>
				</React.Fragment>
			);
		};

		return (
			<div key={name} className={classes.item}>
				<div className={classes.header}>
					<div className={classes.iconAndName}>
						<div className={classes.icon}>{icon}</div>
						<div>{name}</div>
					</div>
					<div className={classes.dropdownIcon}>
						<DropdownIcon onClick={() => (viewAction ? viewAction(id) : '')} />
					</div>
				</div>
				<div className={classes.body}>
					<Typography variant="subtitle2" gutterBottom>
						<span className={classes.rightSpace}>Location: </span>
						<b>{location}</b>
					</Typography>
					<Typography variant="subtitle2" gutterBottom>
						<span className={classes.rightSpace}>Fiat Payments:</span>
						{isFiatPayments
							? fiatPayments.map((payment, index) => (
									<b key={index} className={classes.excluded}>
										{payment}
										{index !== excludedResidents.length - 1 ? ',' : ''}
									</b>
							  ))
							: '-'}
					</Typography>
					<Typography variant="subtitle2" gutterBottom>
						<span className={classes.rightSpace}>Fiat Supported:</span>
						{isFiatSupported
							? fiatSupported.length > 3
								? fourOrMoreFiats(fiatSupported)
								: supportedFiats(fiatSupported)
							: '-'}
					</Typography>
					<Typography variant="subtitle2">
						<span className={classes.rightSpace}>Partnership:</span> -
					</Typography>
				</div>
			</div>
		);
	}
);

export default ExchangesNewListItem;
