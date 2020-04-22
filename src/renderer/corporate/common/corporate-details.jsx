import React from 'react';
import { CardHeader, Card, CardContent, Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CheckMaIcon, AttributeAlertIcon, EditTransparentIcon } from 'selfkey-ui';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	cardContentBox: {
		height: 'initial'
	},
	cardContent: {
		alignItems: 'flex-start',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
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
		display: 'flex',
		marginBottom: '20px',
		flexWrap: 'nowrap',
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
	},
	attrValue: {
		maxWidth: '12em',
		wordBreak: 'break-all'
	}
});

const DetailsAttribute = withStyles(styles)(({ attr, classes, noIcon = false }) =>
	attr ? (
		<Grid container direction="row" justify="flex-start" alignItems="flex-start">
			{!noIcon && (
				<Grid item>
					<CheckMaIcon />
				</Grid>
			)}
			<Grid item className={classes.attrValue}>
				<Typography variant="h5">{attr}</Typography>
			</Grid>
		</Grid>
	) : (
		<Typography variant="h5">
			<AttributeAlertIcon />
			Missing
		</Typography>
	)
);

const AddressDetailsAttribute = withStyles(styles)(({ profile }) => {
	const addressAtr = profile.allAttributes.find(
		attr =>
			attr.type.content.$id ===
			'http://platform.selfkey.org/schema/attribute/physical-address.json'
	);
	let attr = '';

	if (addressAtr) {
		const value = addressAtr.data.value;
		attr = value ? `${value.address_line_1 || ''} ${value.address_line_2 || ''}` : '';
	}

	return <DetailsAttribute attr={attr} />;
});

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
			<CardContent className={classes.cardContentBox}>
				<div className={classes.cardContent}>
					<div className={classes.attr}>
						<Typography className="label" color="secondary">
							Jurisdiction
						</Typography>
						<DetailsAttribute attr={profile.jurisdictionName} />
					</div>
					<div className={classes.attr}>
						<Typography className="label" color="secondary">
							Entity Type
						</Typography>
						<DetailsAttribute attr={profile.entityTypeName} />
					</div>
					<div className={classes.attr}>
						<Typography className="label" color="secondary">
							Incorporation Date
						</Typography>
						<DetailsAttribute attr={profile.creationDate} />
					</div>
					<div className={classes.attr}>
						<Typography className="label" color="secondary">
							Address
						</Typography>
						<AddressDetailsAttribute profile={profile} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
});

export { CorporateDetails };
export default CorporateDetails;
