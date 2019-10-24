import React from 'react';
import { CardHeader, Card, CardContent, Typography, withStyles } from '@material-ui/core';
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
		display: 'block',
		marginBottom: '20px',
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
	const addressAtr = profile.allAttributes.find(
		attr =>
			attr.type.content.$id ===
			'http://platform.selfkey.org/schema/attribute/physical-address.json'
	);
	if (addressAtr) {
		const value = addressAtr.data.value;
		return renderAttr(value ? `${value.address_line_1} ${value.address_line_2}` : '');
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
			<CardContent className={classes.cardContentBox}>
				<div className={classes.cardContent}>
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
					{profile.did && (
						<div className={classes.attr}>
							<Typography className="label" color="secondary">
								DID
							</Typography>
							{profile.did}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
});

export { CorporateDetails };
export default CorporateDetails;
