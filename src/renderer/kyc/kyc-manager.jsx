import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	ListItem,
	List,
	ListItemText,
	Avatar,
	ListItemAvatar,
	withStyles
} from '@material-ui/core';
import { TickIcon, DocumentIcon } from 'selfkey-ui';
import { kycSelectors } from '../../common/kyc';

const styles = theme => () => {};

class KycManagerComponent extends Component {
	renderTemplate(tpl) {
		return (
			<ListItem key={tpl.id}>
				<ListItemText>
					<h3>{tpl.name}</h3>
					<p>{tpl.description}</p>
				</ListItemText>
				<List>
					{(tpl.identity_attributes || []).map((attr, index) =>
						this.renderKycRequirement({ id: attr }, index)
					)}
				</List>
			</ListItem>
		);
	}
	renderKycRequirement(requirement, index) {
		const { classes = {} } = this.props;
		return (
			<ListItem key={requirement.name} className={classes.requirementListItem}>
				<ListItemAvatar>
					{requirement.isEntered ? (
						<Avatar className={classes.bullet}>
							<TickIcon />
						</Avatar>
					) : (
						<Avatar className={classes.notEnteredRequeriment}>
							<div>{index + 1}</div>
						</Avatar>
					)}
				</ListItemAvatar>
				<ListItemText disableTypography={true}>{requirement.name}</ListItemText>
				{requirement.type === 'document' && <DocumentIcon />}
			</ListItem>
		);
	}
	render() {
		console.log('Relying party', this.props.relyingParty);
		const { relyingParty } = this.props;
		if (relyingParty.error) {
			return <div>Error connecting to relying party</div>;
		}
		return (
			<div>
				<List>{relyingParty.templates.map(this.renderTemplate.bind(this))};</List>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	relyingParty: kycSelectors.relyingPartySelector(state)
});

export const KycManager = connect(mapStateToProps)(withStyles(styles)(KycManagerComponent));

export default KycManager;
