import React from 'react';
import { Grid, CardHeader, Card, CardContent, Typography, withStyles } from '@material-ui/core';
import { CheckMaIcon, AttributeAlertIcon, EditTransparentIcon } from 'selfkey-ui';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	card: {},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	cardAction: {
		padding: '1em 1em 0'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	attr: {
		margin: '0.5em',
		display: 'block',
		'& .label': {
			display: 'inline-block',
			minWidth: '12em'
		},
		'& h5': {
			display: 'inline-block'
		},
		'& svg': {
			marginRight: '0.5em',
			verticalAlign: 'middle'
		}
	}
});

const renderAttr = attr =>
	attr ? (
		<Typography variant="h5">
			<CheckMaIcon />
			{attr}
		</Typography>
	) : (
		<Typography variant="h5">
			<AttributeAlertIcon />
			Missing
		</Typography>
	);

const renderAddressAtr = profile => {
	const addressAtr = profile.allAttributes.find(a => a.name === 'Address');
	if (addressAtr) {
		const value = addressAtr.data.value;
		return renderAttr(!value ? `${value.address_line_1} ${value.address_line_2}` : '');
	} else return renderAttr('');
};

const editAction = onEdit => (
	<div onClick={onEdit}>
		<EditTransparentIcon />
	</div>
);

const CorporateDetails = withStyles(styles)(props => {
	const { classes, profile, onEdit } = props;
	return (
		<Card>
			<CardHeader
				title={profile.entityName}
				classes={{
					root: classes.regularText,
					action: classes.cardAction
				}}
				action={editAction(onEdit)}
			/>
			<hr className={classes.hr} />
			<CardContent>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="flex-start"
					spacing={24}
				>
					<div className={classes.attr}>
						<Typography className="label" color="secondary">
							Jurisdiction
						</Typography>
						{renderAttr(profile.jurisdiction)}
					</div>
					<div className={classes.attr}>
						<Typography className="label" color="secondary">
							Entity Type
						</Typography>
						{renderAttr(profile.entityType)}
					</div>
					<div className={classes.attr}>
						<Typography className="label" color="secondary">
							Incorporation Date
						</Typography>
						{renderAttr(profile.creationDate)}
					</div>
					<div className={classes.attr}>
						<Typography className="label" color="secondary">
							Address
						</Typography>
						{renderAddressAtr(profile)}
					</div>
				</Grid>
			</CardContent>
		</Card>
	);
});

export { CorporateDetails };
export default CorporateDetails;
