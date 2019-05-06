import React from 'react';
import { Button, TableRow, TableCell, Typography, withStyles } from '@material-ui/core';
import { Tag } from 'selfkey-ui';

const styles = theme => ({
	icon: {
		alignItems: 'center',
		borderRadius: '5px',
		display: 'flex',
		justifyContent: 'center',
		height: '30px',
		width: '30px'
	},

	noRightPadding: {
		padding: '0 0 0 20px'
	},

	link: {
		cursor: 'pointer'
	},

	footer: {
		margin: '20px'
	},

	button: {
		fontSize: '14px',
		fontWeight: 400,
		minWidth: 0,
		textTransform: 'capitalize'
	},

	inline: {
		display: 'flex',
		flexWrap: 'wrap'
	},

	smallCell: {
		padding: '0 10px',
		whiteSpace: 'normal',
		width: '100px',
		wordBreak: 'break-word'
	},

	excluded: {
		padding: '10px',
		whiteSpace: 'normal',
		width: '100px',
		wordBreak: 'break-word'
	},

	goodForCell: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		height: 'initial',
		justifyContent: 'flex-start',
		maxWidth: '143px',
		padding: '10px',
		width: '143px'
	},

	fee: {
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	},

	feeWrap: {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		maxWidth: '90px'
	},

	resident: {
		marginBottom: '3px',
		marginRight: '5px',
		marginTop: '3px'
	}
});

export const MarketplaceServicesListItem = withStyles(styles)(
	({
		classes,
		children,
		name,
		location,
		fees,
		fiatSupported,
		fiatPayments,
		excludedResidents,
		logoUrl,
		status,
		viewAction
	}) => {
		const getButtonText = status => {
			return status === 'Inactive' ? 'Coming Soon' : 'Details';
		};

		const getColors = () => ['#46dfba', '#46b7df', '#238db4', '#25a788', '#0e4b61'];
		let random = Math.floor(Math.random() * 4);

		const icon = logoUrl ? (
			<img src={logoUrl} className={classes.icon} />
		) : (
			<div
				className={classes.icon}
				style={{
					backgroundColor: getColors()[random]
				}}
			>
				{name.charAt(0)}
			</div>
		);

		const isNotExcludedResidents =
			excludedResidents.length === 0 || excludedResidents[0] === 'None';

		const isFiatSupported = fiatSupported.length !== 0;
		const isFiatPayments = fiatPayments.length !== 0;

		return (
			<TableRow key={name}>
				<TableCell className={classes.noRightPadding}>{icon}</TableCell>
				<TableCell>
					<Typography variant="h6">{name}</Typography>
				</TableCell>
				<TableCell>
					<Typography variant="h6">{location}</Typography>
				</TableCell>
				<TableCell className={classes.feeWrap}>
					<Typography variant="h6" className={classes.fee} title={fees}>
						{fees === 'N.A.' ? '-' : fees}
					</Typography>
				</TableCell>
				<TableCell>
					{isFiatSupported
						? fiatSupported.map((fiat, index) => <Tag key={index}>{fiat}</Tag>)
						: '-'}
				</TableCell>
				<TableCell>
					{isFiatPayments
						? fiatPayments.map((payment, index) => (
								<Typography variant="h6" key={index} className={classes.excluded}>
									{payment}
									{index !== excludedResidents.length - 1 ? ',' : ''}
								</Typography>
						  ))
						: '-'}
				</TableCell>
				<TableCell
					className={
						isNotExcludedResidents || excludedResidents.length < 2
							? ''
							: classes.goodForCell
					}
					style={{ height: 'auto', padding: '10px' }}
				>
					{isNotExcludedResidents
						? '-'
						: excludedResidents.map((excluded, index) =>
								excludedResidents.length - 1 > index ? (
									<p key={index} className={classes.resident}>
										{excluded},
									</p>
								) : (
									excluded
								)
						  )}
				</TableCell>
				<TableCell>
					<Button
						disabled={status === 'Inactive'}
						variant="text"
						color={status === 'Inactive' ? 'secondary' : 'primary'}
						className={classes.button}
						onClick={() => (viewAction ? viewAction(name) : '')}
					>
						{getButtonText(status)}
					</Button>
				</TableCell>
			</TableRow>
		);
	}
);

export default MarketplaceServicesListItem;
