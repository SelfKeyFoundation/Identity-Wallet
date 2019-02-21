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
	componentDidMount() {
		// TODO: update KYC process on this.props.transaction
		console.log(this.props);
	}

	render() {
		return null;
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
