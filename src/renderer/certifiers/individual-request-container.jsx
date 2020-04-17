import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
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
		const { item, documents, identity, firstName, lastName } = this.props;
		return (
			<IndividualRequestPage
				handleBackClick={this.handleBackClick}
				documents={documents}
				firstName={firstName}
				lastName={lastName}
				did={identity.did}
				item={item}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...identitySelectors.selectIndividualProfile(state),
		item: {
			applicationDate: '2019-11-07T12:10:37.655Z',
			createdAt: 1573128638021,
			currentStatus: 9,
			currentStatusName: 'In Progress',
			id: '5dc409bd39ba9cb7b55e6f89',
			identityId: '1',
			nextRoute: null,
			owner: null,
			payments: {
				amount: 0.25,
				amountKey: '118.19742389097111764263',
				date: 1573133063725,
				status: 'Sent KEY',
				transactionHash:
					'0xb44e698e2afa54f3a8600547300bcb734254fa357664fd5e02bf9bd371abff38'
			},
			rpName: 'flagtheory_certif',
			scope: null,
			sub_title: null,
			updatedAt: 1573205235431,
			walletId: null
		}
	};
};

export const IndividualRequest = connect(mapStateToProps)(
	withStyles(styles)(IndividualRequestContainer)
);

export default IndividualRequest;
