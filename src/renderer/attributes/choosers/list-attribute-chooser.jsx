import React from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Radio, IconButton, Typography } from '@material-ui/core';
import { FullAttributeRenderer } from '../renderers';
import { makeStyles } from '@material-ui/styles';
import { MuiAddIcon, MuiEditIcon, white, grey } from 'selfkey-ui';

const useStyles = makeStyles(theme => ({
	selectionSection: {
		width: 60,
		borderRight: '1px solid #384656',
		padding: 20
	},
	actionSection: {
		width: 60,
		borderLeft: '1px solid #384656',
		padding: '15px 10px 0px 15px'
	},
	bodySection: {
		padding: '10px 20px'
	},
	option: {
		borderColor: '#384656',
		borderRadius: 5,
		borderWidth: 1,
		borderStyle: 'solid',
		padding: 0,
		marginBottom: 5
	},
	action: {
		width: '100%',
		textAlign: 'center'
	},
	addIcon: {
		fill: grey,
		height: '30px',
		width: '30px',
		'&:hover': {
			fill: white
		}
	}
}));

export const ListAttributeChooser = ({
	attributes,
	typesByTypeId,
	selected,
	onSelectOption,
	onEditAttribute,
	onAddAttribute
}) => {
	const classes = useStyles();
	return (
		<Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={0}>
			{attributes.length > 0 ? (
				attributes.map(attr => (
					<Grid item key={attr.id} className={classes.option}>
						<Grid
							container
							direction="row"
							justify="flex-start"
							spacing={0}
							wrap="nowrap"
						>
							<Grid item className={classes.selectionSection}>
								<Radio
									checked={selected === attr.id}
									onChange={onSelectOption}
									value={attr.id}
									name="radio-button-option"
								/>
							</Grid>
							<Grid item xs className={classes.bodySection}>
								<FullAttributeRenderer
									attribute={attr}
									type={typesByTypeId[attr.typeId]}
								/>
							</Grid>
							{onEditAttribute && (
								<Grid item className={classes.actionSection}>
									<IconButton
										aria-label="Edit"
										onClick={() => onEditAttribute(attr)}
									>
										<MuiEditIcon />
									</IconButton>
								</Grid>
							)}
						</Grid>
					</Grid>
				))
			) : (
				<Grid item>
					<Typography variant="body1">No attributes</Typography>
				</Grid>
			)}
			{onAddAttribute && (
				<Grid item className={classes.action}>
					<IconButton aria-label="Add" size="medium" onClick={onAddAttribute}>
						<MuiAddIcon classes={{ root: classes.addIcon }} />
					</IconButton>
				</Grid>
			)}
		</Grid>
	);
};

ListAttributeChooser.propTypes = {
	attributes: PropTypes.arrayOf(PropTypes.object),
	typesByTypeId: PropTypes.object,
	selected: PropTypes.number,
	onSelectOption: PropTypes.func.isRequired,
	onEditAttribute: PropTypes.func,
	onAddAttribute: PropTypes.func
};

ListAttributeChooser.defaultProps = {
	attributes: [],
	typesByTypeId: {}
};

export default ListAttributeChooser;
