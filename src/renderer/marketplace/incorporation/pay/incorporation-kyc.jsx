import React from 'react';
import { connect } from 'react-redux';
// import { push } from 'connected-react-router';
import { getWallet } from 'common/wallet/selectors';
import { withStyles } from '@material-ui/core/styles';
// import { Grid, Typography, Button } from '@material-ui/core';
// import { CloseButtonIcon, HourGlassLargeIcon } from 'selfkey-ui';
import { incorporationsSelectors } from 'common/incorporations';
import { pricesSelectors } from 'common/prices';
import { transactionSelectors } from 'common/transaction';
import { kycOperations } from 'common/kyc';

const styles = theme => ({
	container: {
		position: 'relative',
		width: '100%',
		margin: '0 auto',
		maxWidth: '960px'
	},
	containerHeader: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: '1em',
			marginTop: '0.25em',
			marginBottom: '0',
			fontSize: '24px'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-24px',
		top: '-24px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	},
	icon: {
		width: '120px'
	},
	content: {
		width: 'calc(100% - 120px)'
	},
	description: {
		fontFamily: 'Lato, arial',
		color: '#FFF',
		lineHeight: '1.5em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1em'
		},
		'& p.email': {
			color: '#00C0D9',
			padding: '10px 0 10px 0'
		},
		'& strong': {
			fontWeight: '700'
		}
	},
	instructions: {
		padding: '30px 0',
		borderTop: '1px solid #475768'
	},
	footer: {
		width: '100%',
		'& button': {
			marginRight: '30px'
		}
	}
});

export class IncorporationKYC extends React.Component {
	componentWillMount() {
		this.startKYC();
	}

	startKYC = _ => {
		this.props.dispatch(kycOperations.loadRelyingParty('incorporations'));
	};

	render() {
		// TODO: update KYC process on this.props.transaction
		const { program } = this.props;

		// 5c6fadbf77c33d5c28718d7b
		// console.log(this.props);

		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				'incorporations',
				'5c6fadbf77c33d5c28718d7b',
				`/main/marketplace-incorporation/process-started/${
					this.props.match.params.companyCode
				}/${this.props.match.params.countryCode}`,
				'Incorporation Checklist: Singapure',
				`You are about to being the incorporation process in ${
					program.Region
				}. Please double check your required documents are Certified True or Notarized where necessary. Failure to do so will result in delays in the incorporation process. You may also be asked to provide more information by the service provider.`,
				'I understand SelfKey Wallet LLC will pass this information to Far Horizon Capital Inc, that will provide incorporation services in Singapore at my request and will communicate with me at my submitted email address above.'
			)
		);

		return <div />;
	}
}

const mapStateToProps = (state, props) => {
	return {
		publicKey: getWallet(state).publicKey,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		transaction: transactionSelectors.getTransaction(state),
		program: incorporationsSelectors.getIncorporationsDetails(
			state,
			props.match.params.companyCode
		)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(IncorporationKYC));
