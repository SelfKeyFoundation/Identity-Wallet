import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ListItem, List, withStyles } from '@material-ui/core';
import { KycRequirements } from './requirements/container';
import { kycSelectors, kycOperations } from '../../common/kyc';

const styles = theme => () => {};

class KycManagerComponent extends PureComponent {
	componentDidMount() {
		if (this.props.rpShouldUpdate) {
			this.props.dispatch(kycOperations.loadRelyingParty(this.props.relyingPartyName));
		}
	}
	renderTemplate(tpl) {
		return (
			<ListItem key={tpl.id}>
				<KycRequirements
					relyingPartyName={this.props.relyingPartyName}
					templateId={tpl.id}
					title={tpl.name}
					subtitle={tpl.description}
				/>
			</ListItem>
		);
	}

	render() {
		const { relyingParty } = this.props;
		if (!relyingParty || relyingParty.error) {
			return <div>Error connecting to relying party</div>;
		}
		return (
			<div>
				<List>{relyingParty.templates.map(this.renderTemplate.bind(this))};</List>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => ({
	relyingParty: kycSelectors.relyingPartySelector(state, props.relyingPartyName),
	rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(state, props.relyingPartyName)
});

export const KycManager = connect(mapStateToProps)(withStyles(styles)(KycManagerComponent));

export default KycManager;
