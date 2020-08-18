import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Button, Typography, Divider } from '@material-ui/core';
import { baseDark, grey, CloseButtonIcon } from 'selfkey-ui';
import { RequestDocumentsList } from './request-documents-list-container';
import { NotariesServiceCost } from '../common/notaries-service-cost';

const styles = theme => ({
	container: {
		margin: '0 auto',
		maxWidth: '960px',
		position: 'relative',
		width: '100%'
	},
	containerHeader: {
		alignItems: 'flex-start',
		background: '#2A3540',
		display: 'flex',
		justifyContent: 'flex-start',
		padding: '20px 30px',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-20px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	},
	howItWorks: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	howItWorksBox: {
		background: '#313D49',
		borderRadius: '4px',
		boxSizing: 'border-box',
		color: '#FFF',
		height: '178px',
		margin: '0 0 2em 0',
		minHeight: '178px',
		padding: '2em 3%',
		width: '32%',
		'& header': {
			display: 'flex'
		},
		'& header h4': {
			display: 'inline-block',
			fontSize: '16px',
			fontWeight: 500,
			marginLeft: '0.5em',
			marginTop: '-3px'
		},
		'& header span': {
			color: '#00C0D9',
			fontSize: '20px',
			fontWeight: 'bold'
		}
	},
	divider: {
		height: '2px',
		marginBottom: '20px'
	},
	textArea: {
		backgroundColor: baseDark,
		boxSizing: 'border-box',
		border: '1px solid #384656',
		borderRadius: '4px',
		color: grey,
		fontFamily: 'Lato,arial,sans-serif',
		fontSize: '14px',
		lineHeight: '21px',
		marginBottom: '40px',
		outline: 'none',
		padding: '10px 15px',
		width: '100%',
		'&::placeholder': {
			color: grey
		}
	},
	requestBtn: {
		marginRight: '20px'
	}
});

export const RequestNotarizationPage = withStyles(styles)(props => {
	const { documents, selectedDocuments, product, keyRate, gasEthFee, gasUsdFee } = props;
	const {
		classes,
		onBackClick,
		handleAddDocument,
		onStartClick,
		handleSelectDocument,
		handleMessage,
		message,
		...passedProps
	} = props;
	const price = product && product.price ? product.price : 0;

	return (
		<div className={classes.container}>
			<CloseButtonIcon onClick={onBackClick} className={classes.closeIcon} />
			<div className={classes.containerHeader}>
				<Typography variant="h2" className="region">
					Notarization Service
				</Typography>
			</div>
			<div className={classes.contentContainer}>
				<Typography variant="h2" gutterBottom>
					How the process works
				</Typography>
				<div className={classes.howItWorks}>
					<div className={classes.howItWorksBox}>
						<header className={classes.header}>
							<span>1</span>
							<Typography variant="h4" gutterBottom>
								Provide documents you want notarized
							</Typography>
						</header>
						<div>
							<Typography variant="subtitle2" color="secondary">
								You will be required to provide standard information about yourself,
								and the documents you wished notarized.
							</Typography>
						</div>
					</div>
					<div className={classes.howItWorksBox}>
						<header className={classes.header}>
							<span>2</span>
							<Typography variant="h4" gutterBottom>
								Video Call
							</Typography>
						</header>
						<div>
							<Typography variant="subtitle2" color="secondary">
								You will be connected live with a notary, so they can confirm your
								identity face-to-face on a webcam. Please make sure your device has
								a camera.
							</Typography>
						</div>
					</div>
					<div className={classes.howItWorksBox}>
						<header className={classes.header}>
							<span>3</span>
							<Typography variant="h4" gutterBottom>
								Receive the notarized documents
							</Typography>
						</header>
						<div>
							<Typography variant="subtitle2" color="secondary">
								Once the notarization process is done you will receive all the
								documents notarized in your Selfkey wallet.
							</Typography>
						</div>
					</div>
				</div>
				<Divider className={classes.divider} />
				<div>
					<Typography variant="h2" gutterBottom>
						Select the documents you want notarized
					</Typography>
					<RequestDocumentsList
						documents={documents}
						onAddDocument={handleAddDocument}
						onSelectDocument={handleSelectDocument}
						{...passedProps}
					/>
				</div>
				<div>
					<Typography variant="overline" gutterBottom>
						Message for Notary*
					</Typography>
					<textarea
						className={classes.textArea}
						rows="5"
						onChange={handleMessage}
						value={message}
						placeholder="Please describe the work that needs to be done…."
					/>
				</div>
				<Divider className={classes.divider} />
				<NotariesServiceCost
					selectedDocuments={selectedDocuments}
					price={price}
					keyRate={keyRate}
					gasEthFee={gasEthFee}
					gasUsdFee={gasUsdFee}
				/>
				<div>
					<Button
						className={classes.requestBtn}
						variant="contained"
						size="large"
						onClick={onStartClick}
						disabled={!selectedDocuments.length}
					>
						Request Notarization
					</Button>
					<Button variant="outlined" size="large" onClick={onBackClick}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
});

export default RequestNotarizationPage;
