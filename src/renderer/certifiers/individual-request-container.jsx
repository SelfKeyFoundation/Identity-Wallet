import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { identitySelectors } from 'common/identity';
import IndividualRequestPage from './individual-request-page';

const styles = theme => ({});

class IndividualRequestContainer extends PureComponent {
	state = {};

	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
	};

	render() {
		const { documents, identity, firstName, lastName } = this.props;
		return (
			<IndividualRequestPage
				handleBackClick={this.handleBackClick}
				documents={documents}
				firstName={firstName}
				lastName={lastName}
				did={identity.did}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...identitySelectors.selectIndividualProfile(state)
	};
};

export const IndividualRequest = connect(mapStateToProps)(
	withStyles(styles)(IndividualRequestContainer)
);

export default IndividualRequest;
