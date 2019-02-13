import React from 'react';
import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Paper, Modal } from '@material-ui/core';
import {
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	Copy
} from 'selfkey-ui';
import { Link } from 'react-router-dom';

const styles = theme => ({
	modalHeader: {
		'& svg': {
			width: '1.5em !important',
			height: '1.5em !important',
			position: 'relative',
			top: '-5px',
			marginRight: '0.5em'
		}
	},
	cryptoIcon: {
		marginRight: '20px'
	},
	cryptoSymbol: {
		fontSize: '14px',
		fontWeight: 'normal'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	modalContentWrapper: {
		boxShadow: 'none',
		marginBottom: '20px'
	},
	closeIcon: {
		'& svg': {
			position: 'relative',
			top: '20px'
		}
	},
	tokenPublicKey: {
		'& > p': {
			display: 'inline'
		},
		'& > button': {
			display: 'inline'
		}
	},
	tokenAddress: {
		padding: '20px 0',
		textAlign: 'center'
	},
	qrCode: {
		textAlign: 'center',
		marginBottom: '20px',
		'& canvas': {
			background: '#FFF',
			padding: '10px'
		}
	}
});

const goBackDashboard = props => <Link to="/main/dashboard" {...props} />;

export class IncorporationCheckout extends React.Component {
	render() {
		const { classes, publicKey, country } = this.props;

		return (
			<Modal open={true}>
				<ModalWrap className={classes.modalWrap}>
					<Paper className={classes.modalContentWrapper}>
						<ModalCloseButton className={classes.closeIcon} component={goBackDashboard}>
							<ModalCloseIcon />
						</ModalCloseButton>

						<ModalHeader className={classes.modalHeader}>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="center"
								spacing={0}
							>
								<Typography variant="body2" gutterBottom>
									Pay Incorporation Fee: {country}
								</Typography>
							</Grid>
						</ModalHeader>

						<ModalBody />
					</Paper>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		publicKey: getWallet(state).publicKey
	};
};

export default connect(mapStateToProps)(withStyles(styles)(IncorporationCheckout));
