import React from 'react';
import { TableRow, TableCell, Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Tag } from 'selfkey-ui';
import { DetailsIconButton } from '../common';

const styles = theme => ({
	defaultIcon: {
		alignItems: 'center',
		borderRadius: '5px',
		display: 'flex',
		justifyContent: 'center',
		maxWidth: '30px'
	},
	generatedIcon: {
		height: '30px',
		width: '30px'
	},
	noRightPadding: {
		padding: '0 0 0 20px !important'
	},
	link: {
		cursor: 'pointer'
	},
	footer: {
		margin: '20px'
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
		padding: '10px 10px 10px 0',
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
		maxWidth: '300px',
		padding: '10px'
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
		marginRight: '5px',
		whiteSpace: 'initial'
	},
	exchangeName: {
		maxWidth: '120px',
		paddingLeft: '15px',
		whiteSpace: 'pre-line'
	},
	hidden: {
		display: 'none'
	},
	excludedResidentCell: {
		minWidth: '200px'
	},
	detailsCell: {
		color: '#00C0D9',
		padding: '15px 20px',
		'& span': {
			cursor: 'pointer'
		},
		'& button': {
			maxWidth: '15px',
			minWidth: '15px',
			padding: 0,
			width: '15px'
		}
	},
	'@media screen and (min-width: 1230px)': {
		excludedResidentCell: {
			minWidth: '290px'
		}
	}
});

export const ExchangesListItem = withStyles(styles)(
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

		const isNotExcludedResidents =
			excludedResidents === '-' ||
			excludedResidents.length === 0 ||
			excludedResidents[0] === 'None';

		const isFiatSupported =
			fiatSupported !== '-' &&
			fiatSupported.length !== 0 &&
			fiatSupported[0] !== 'Not Available';

		const isFiatPayments =
			fiatPayments !== '-' &&
			fiatPayments.length !== 0 &&
			fiatPayments[0] !== 'Not Available';

		return (
			<TableRow key={name}>
				<TableCell className={classes.noRightPadding}>{icon}</TableCell>
				<TableCell className={classes.exchangeName}>
					<Typography variant="h6">{name}</Typography>
				</TableCell>
				<TableCell>
					<Typography variant="h6">{location}</Typography>
				</TableCell>
				<TableCell className={allFeesEmpty ? classes.hidden : classes.feeWrap}>
					<Typography variant="h6" className={classes.fee} title={fees}>
						{fees === 'N.A.' ? '-' : fees}
					</Typography>
				</TableCell>
				<TableCell>
					<Grid container>
						{isFiatSupported
							? fiatSupported.map((fiat, index) => <Tag key={index}>{fiat}</Tag>)
							: '-'}
					</Grid>
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
							? classes.excludedResidentCell
							: `${classes.goodForCell} ${classes.excludedResidentCell}`
					}
					style={{ height: 'auto', padding: '10px' }}
				>
					{isNotExcludedResidents
						? '-'
						: excludedResidents.map((excluded, index) =>
								excludedResidents.length - 1 > index ? (
									<Typography
										variant="h6"
										key={index}
										className={classes.resident}
									>
										{excluded},
									</Typography>
								) : (
									<Typography
										variant="h6"
										key={index}
										className={classes.resident}
									>
										{excluded}
									</Typography>
								)
						  )}
				</TableCell>
				<TableCell className={classes.detailsCell}>
					<DetailsIconButton
						onClick={() => (viewAction ? viewAction(id) : '')}
						disabled={status === 'Inactive'}
					/>
				</TableCell>
			</TableRow>
		);
	}
);

export default ExchangesListItem;
